import referralEntity from './referral.entity';

import userService from '../user/user.service';
import paymentService from '../payment/payment.service';
import transactionService from '../transaction/transaction.service';

import softpay from '../common/softpay';

import { User } from '../user/dto/user.dto';
import { Referral } from './dto/referral.dto';
import { Common } from '@/interfaces/common.dto';
import { Transaction } from '../transaction/dto/transaction.dto';
import { CreateTransactionDto } from '../transaction/dto/create-transaction.dto';
import { UpdateBalancePaymentDto } from '../payment/dto/update-balance-payment.dto';

import { generateCodes } from '@/utils/common/codes';

class ReferralService {
  async findByFilters(f: Common.GetByFilters<Referral.Dto>) {
    const e = referralEntity.find(f.filters, null, f.options);
    if (f.select) e.select(f.select);
    if (f.populate) e.populate(f.populate);
    if (f.lean) e.lean();
    return e;
  }

  async findOneByFilters(f: Common.GetByFilters<Referral.Dto>) {
    const e = referralEntity.findOne(f.filters, null);
    if (f.select) e.select(f.select);
    if (f.populate) e.populate(f.populate);
    if (f.lean) e.lean();
    return e;
  }

  async exists({ filters }: Common.Filters<Referral.Dto>) {
    return referralEntity.exists(filters);
  }

  async count({ filters }: Common.Filters<Referral.Dto>) {
    return referralEntity.countDocuments(filters);
  }

  async create(user: Common.BaseModel['_id']) {
    const exist = this.exists({ filters: { user } });
    if (!exist) return false;

    const code = String(generateCodes({ length: 16, count: 1 }));
    return referralEntity.create({ user, code });
  }

  async createMany(users: Array<Common.BaseModel['_id']>) {
    const dtos = users.map((user) => ({
      user,
      code: String(generateCodes({ length: 16, count: 1 })),
    }));
    return referralEntity.insertMany(dtos);
  }

  async update({ filters, update, updated }: Common.UpdateByFilters<Referral.Dto>) {
    return referralEntity.findOneAndUpdate(filters, update, { new: updated }).lean();
  }

  async addMember(code: string, member: Common.BaseModel['_id']) {
    const referralUpdate: Common.UpdateByFilters<Referral.Dto> = {
      filters: { code },
      update: { $push: { members: { active: false, member } } },
    };
    const referral = await this.update(referralUpdate);

    const referrerUpdate: Common.UpdateByFilters<Referral.Dto> = {
      filters: { user: member },
      update: { parent: referral?._id },
    };
    return this.update(referrerUpdate);
  }

  async addMemberByPatrion(member: Common.BaseModel['_id']) {
    const userFilters: Common.GetByFilters<User.Dto> = {
      filters: { role: User.Role.PATRION },
      select: '_id',
      lean: true,
    };
    const patrions = await userService.findByFilters(userFilters);
    if (!patrions.length) return false;

    const referralFilters: Common.GetByFilters<Referral.Dto> = {
      filters: { user: { $in: patrions.map((u) => u._id) } },
      options: { sort: { _id: -1 } },
      select: 'code members',
      lean: true,
    };
    const referrals = await this.findByFilters(referralFilters);
    if (!referrals.length) return false;

    const referral = referrals.reduce((i, ac) => (i.members.length < ac.members.length ? i : ac));
    return this.addMember(referral.code, member);
  }

  async updateActive(data: { member: Common.BaseModel['_id']; active: boolean }) {
    const referralUpdate: Common.UpdateByFilters<Referral.Dto> = {
      filters: { 'members.member': data.member },
      update: { 'members.$.active': data.active },
    };
    return this.update(referralUpdate);
  }

  async getReferralParent(user: Common.BaseModel['_id']) {
    const referralFilters: Common.GetByFilters<Referral.Dto> = {
      filters: { user },
      populate: [
        { path: 'user', select: 'activated' },
        {
          path: 'parent',
          select: 'parent user',
          populate: [
            { path: 'user', select: 'activated' },
            {
              path: 'parent',
              select: 'parent user',
              populate: [{ path: 'user', select: 'activated' }],
            },
          ],
        },
      ],
    };
    const list = [] as string[];
    const referral = await this.findOneByFilters(referralFilters);
    if (!referral || !referral.parent) return [];

    const returnParent = (referral: Referral.Dto) => {
      if (referral.parent && referral.parent.user?.activated) {
        list.push(...returnParent(referral.parent));
      }
      return [String(referral.user._id)];
    };

    return returnParent(referral.parent);
  }

  async updatePayments(user: Common.BaseModel['_id'], amount: number) {
    const referralFilters: Common.GetByFilters<Referral.Dto> = {
      filters: { user },
      populate: [
        { path: 'user', select: 'activated' },
        {
          path: 'parent',
          select: 'parent user',
          populate: [
            { path: 'user', select: 'activated' },
            {
              path: 'parent',
              select: 'parent user',
              populate: [{ path: 'user', select: 'activated' }],
            },
          ],
        },
      ],
    };
    const referral = await this.findOneByFilters(referralFilters);
    if (!referral || !referral.parent || !referral.parent.user?.activated) return;

    let index = 0;
    let totalReferralAmount = 0;
    const referralUpdate = async (referral: Referral.Dto) => {
      const total = amount * ((Referral.Percent[index] || 3) / 100);
      totalReferralAmount += total;

      const dto: UpdateBalancePaymentDto = {
        filters: { user: referral.user._id },
        amount: total,
        inc: 1,
      };
      const payment = await paymentService.updateBalance(dto);
      if (payment) {
        const transactionCreate: CreateTransactionDto = {
          user: referral.user._id,
          payment: payment._id,
          order: `REFERRAL_${generateCodes({ length: 12, count: 1 })}`,
          type: Transaction.Type.REFERRAL,
          status: Transaction.Status.COMPLETED,
          amount: dto.amount,
        };
        await transactionService.create(transactionCreate);
      }

      index++;
      if (!referral.parent || !referral.user?.activated)
        return softpay.conclusion(totalReferralAmount);
      referralUpdate(referral.parent);
    };
    referralUpdate(referral.parent);
  }

  async updateMany({ filters, update }: Common.UpdateByFilters<Referral.Dto>) {
    return referralEntity.updateMany(filters, update);
  }

  async updateDoc({ doc, update }: Common.UpdateDoc<Referral.Dto>) {
    return doc.updateOne(update, { new: true });
  }

  async delete({ filters }: Common.Filters<Referral.Dto>) {
    return referralEntity.findOneAndDelete(filters);
  }

  async deleteMany({ filters }: Common.Filters<Referral.Dto>) {
    return referralEntity.deleteMany(filters);
  }
}

export default new ReferralService();
