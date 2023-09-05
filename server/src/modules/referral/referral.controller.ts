import { Request, Response } from 'express';

import referralService from './referral.service';
import transactionService from '../transaction/transaction.service';
import referralConstants from './referral.constants';

import { User } from '../user/dto/user.dto';
import { Referral } from './dto/referral.dto';
import { Common } from '@/interfaces/common.dto';
import { Transaction } from '../transaction/dto/transaction.dto';

import { Converter, Access, VerifyRoles } from '@/decorators';

import response, { ErrorHandler } from '@/utils/response';
import { definePagination } from '@/utils/define';

class ReferralController {
  @Access()
  @VerifyRoles(User.Role.ADMIN)
  @Converter('common_query_list')
  @ErrorHandler()
  async getList(req: Request, res: Response) {
    const query = req.query as Common.GetList;
    const options = { sort: { _id: 1 } };
    definePagination(options, query);

    const referralFilters: Common.GetByFilters<Referral.Dto> = {
      filters: {},
      options,
      populate: [
        { path: 'user', select: 'name' },
        { path: 'members.member', select: 'name phone' },
      ],
      lean: true,
    };
    const referrals = await referralService.findByFilters(referralFilters);
    const total = await referralService.count(referralFilters);

    const transactionFilters: Common.GetByFilters<Transaction.Dto> = {
      filters: { type: Transaction.Type.REFERRAL },
      select: 'user amount',
      lean: true,
    };
    const transactions = await transactionService.findByFilters(transactionFilters);

    for (const referral of referrals)
      referral.amount = transactions
        .filter((t) => String(t.user) === String(referral.user?._id))
        .reduce((acc, t) => acc + t.amount, 0);

    response.ok(res, null, referrals, total);
  }

  @Access()
  @ErrorHandler()
  async getItem(_: Request, res: Response) {
    const user = res.locals.user._id;

    const referralFilters: Common.GetByFilters<Referral.Dto> = {
      filters: { user },
      populate: {
        path: 'members.member',
        select: 'name avatar about phone birthday',
        populate: { path: 'avatar', select: 'src cover type' },
      },
      lean: true,
    };
    const referral = await referralService.findOneByFilters(referralFilters);
    if (!referral) return response.notFound(res, referralConstants.NOT_FOUND);

    referral.members = referral.members.filter((m) => m.member && m.active);
    response.ok(res, null, referral);
  }

  @ErrorHandler()
  async validate(req: Request, res: Response) {
    const query = req.query as { code: string };

    const referralFilters: Common.GetByFilters<Referral.Dto> = {
      filters: { code: query.code },
      populate: { path: 'user', select: 'name' },
      select: 'user',
    };
    const referral = await referralService.findOneByFilters(referralFilters);
    if (!referral) return response.notFound(res);

    response.ok(res, null, referral);
  }

  @Access()
  @ErrorHandler()
  async viewed(_: Request, res: Response) {
    const user = res.locals.user._id;

    const referralFilters: Common.GetByFilters<Referral.Dto> = {
      filters: { user },
      select: 'members',
    };
    const referral = await referralService.findOneByFilters(referralFilters);
    if (!referral) return response.ok(res);

    for (const member of referral.members) member.viewed = true;
    await referral.save();

    response.ok(res);
  }
}

export default new ReferralController();
