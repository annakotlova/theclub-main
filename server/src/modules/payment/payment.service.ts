import crypto from 'crypto';
import paymentEntity from './payment.entity';

import { Payment } from './dto/payment.dto';
import { Common } from '@/interfaces/common.dto';
import { UpdateBalancePaymentDto } from './dto/update-balance-payment.dto';

import { ErrorHandler } from '@/utils/response';

class PaymentService {
  async findByFilters(f: Common.GetByFilters<Payment.Dto>) {
    const e = paymentEntity.find(f.filters, null, f.options);
    if (f.select) e.select(f.select);
    if (f.populate) e.populate(f.populate);
    if (f.lean) e.lean();
    return e;
  }

  async findOneByFilters(f: Common.GetByFilters<Payment.Dto>) {
    const e = paymentEntity.findOne(f.filters, null);
    if (f.select) e.select(f.select);
    if (f.populate) e.populate(f.populate);
    if (f.lean) e.lean();
    return e;
  }

  generateBalanceHash(balance: number) {
    return crypto
      .createHash('sha256')
      .update(`${balance}${process.env.SECRET_BALANCE}`)
      .digest('hex');
  }

  validateBalanceHash(payment: Payment.Dto) {
    return payment.balanceHash === this.generateBalanceHash(payment.balance);
  }

  @ErrorHandler({ request: false })
  async updateBalance(dto: UpdateBalancePaymentDto) {
    const payment = await this.findOneByFilters({ filters: dto.filters });
    if (!payment) return false;

    const balance = payment.balance + dto.amount * dto.inc;
    await this.updateDoc({
      doc: payment,
      update: {
        balance,
        updatedAt: new Date(),
        balanceHash: this.generateBalanceHash(balance),
      },
    });

    // TODO: socket update
    return { _id: payment._id, balance };
  }

  async exists({ filters }: Common.Filters<Payment.Dto>) {
    return paymentEntity.exists(filters);
  }

  async count({ filters }: Common.Filters<Payment.Dto>) {
    return paymentEntity.countDocuments(filters);
  }

  async create(user: Common.BaseModel['_id']) {
    const dto = { user, balance: 0, balanceHash: this.generateBalanceHash(0) };
    return paymentEntity.create(dto);
  }

  async createMany(users: Array<Common.BaseModel['_id']>) {
    const dtos = users.map((user) => ({
      user,
      balance: 0,
      balanceHash: this.generateBalanceHash(0),
      subscriptionAt: Date.now() + 180 * 86_400 * 1_000,
    }));
    return paymentEntity.create(dtos);
  }

  async update({ filters, update, updated, select }: Common.UpdateByFilters<Payment.Dto>) {
    const e = paymentEntity.findOneAndUpdate(filters, update, { new: updated });
    if (select) e.select(select);
    return e.lean();
  }

  async updateMany({ filters, update }: Common.UpdateByFilters<Payment.Dto>) {
    return paymentEntity.updateMany(filters, update);
  }

  async updateDoc({ doc, update }: Common.UpdateDoc<Payment.Dto>) {
    return doc.updateOne(update, { new: true });
  }

  async delete({ filters }: Common.Filters<Payment.Dto>) {
    return paymentEntity.findOneAndDelete(filters);
  }

  async deleteMany({ filters }: Common.Filters<Payment.Dto>) {
    return paymentEntity.deleteMany(filters);
  }
}

export default new PaymentService();
