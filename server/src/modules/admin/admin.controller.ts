import { Request, Response } from 'express';

import transactionService from '../transaction/transaction.service';
import referralService from '../referral/referral.service';

import { User } from '../user/dto/user.dto';
import { Common } from '@/interfaces/common.dto';
import { Referral } from '../referral/dto/referral.dto';
import { Transaction } from '../transaction/dto/transaction.dto';
import { GetStatisticAdminDto } from './dto/get-statistic-admin.dto';

import { VerifyRoles, Access } from '@/decorators';

import response, { ErrorHandler } from '@/utils/response';
import { preparingMonthDates, uniqueMonthObject } from '@/utils/diagrams';

class AdminController {
  @Access()
  @VerifyRoles(User.Role.ADMIN)
  @ErrorHandler()
  async getStatistic(req: Request, res: Response) {
    const query = req.query as GetStatisticAdminDto;

    const statistic = ['referral', 'referralParent', 'income', 'conclusion'];
    const start = new Date(query.started || '01/01/2023');
    const end = new Date(query.ended || Date.now());

    const data = await Promise.all([
      this.getReferralCount(start, end),
      this.getReferralCount(start, end, true),
      this.getIncomeCount(start, end),
      this.getConclusionCount(start, end),
    ]);
    const result = data.reduce((a, v, index) => ({ ...a, [statistic[index] as string]: v }), {});
    response.ok(res, null, result);
  }

  @Access()
  @VerifyRoles(User.Role.ADMIN)
  @ErrorHandler()
  async getDiagrams(_: Request, res: Response) {
    const started = new Date(`01/01/2023`);
    const ended = new Date(`12/31/2023`);

    const transactionFilters: Common.GetByFilters<Transaction.Dto> = {
      filters: {
        type: { $ne: Transaction.Type.REFERRAL },
        status: Transaction.Status.COMPLETED,
        createdAt: { $gte: started, $lte: ended },
      },
      lean: true,
    };
    const transactions = await transactionService.findByFilters(transactionFilters);
    preparingMonthDates(transactions, 'createdAt');

    const payment = [Transaction.Type.PAYMENT, Transaction.Type.CREDIT, Transaction.Type.PAYMENT_BALANCE];
    const payments = transactions.filter((t) => payment.includes(t.type));
    const conclusions = transactions.filter((t) => t.type === Transaction.Type.CONCLUSION);
    const t_result = [
      {
        name: 'Пополнения',
        data: uniqueMonthObject(payments, started, ended, 'amount').map((e) => e.quantity),
      },
      {
        name: 'Выводы',
        data: uniqueMonthObject(conclusions, started, ended, 'amount').map((e) => e.quantity),
      },
    ];

    const referralFilters: Common.GetByFilters<Referral.Dto> = {
      filters: {
        createdAt: { $gte: started, $lte: ended },
      },
      lean: true,
      populate: {
        path: 'parent',
        select: 'parent user',
        populate: {
          path: 'parent',
          select: 'parent user',
          populate: {
            path: 'parent',
            select: 'user',
          },
        },
      },
      select: 'parent user createdAt',
    };
    const referrals = await referralService.findByFilters(referralFilters);
    preparingMonthDates(referrals, 'createdAt');

    for (const referral of referrals) referral.level = this.getCurrentLevel(referral, 0);

    const level_1 = referrals.filter((r) => r.level === 1);
    const level_2 = referrals.filter((r) => r.level === 2);
    const level_3 = referrals.filter((r) => r.level === 3);

    const r_result = [
      {
        name: 'Первый уровень',
        data: uniqueMonthObject(level_1, started, ended).map((e) => e.quantity),
      },
      {
        name: 'Второй уровень',
        data: uniqueMonthObject(level_2, started, ended).map((e) => e.quantity),
      },
      {
        name: 'Третий уровень',
        data: uniqueMonthObject(level_3, started, ended).map((e) => e.quantity),
      },
    ];

    response.ok(res, null, { transactions: t_result, referrals: r_result });
  }

  getCurrentLevel(referral: Referral.Dto, level: number): number {
    if (!referral.parent) return level;
    return this.getCurrentLevel(referral.parent, level + 1);
  }

  async getReferralCount(start: Date, end: Date, parent = false) {
    const referralFilters: Common.GetByFilters<Referral.Dto> = {
      filters: { createdAt: { $gte: start, $lte: end } },
    };
    if (parent) referralFilters.filters.parent = { $ne: undefined };
    return await referralService.count(referralFilters);
  }

  async getIncomeCount(start: Date, end: Date) {
    const transactionFilters: Common.GetByFilters<Transaction.Dto> = {
      filters: {
        createdAt: { $gte: start, $lte: end },
        status: Transaction.Status.COMPLETED,
        type: { $ne: Transaction.Type.CONCLUSION },
      },
      select: 'amount type createdAt',
      lean: true,
    };
    const transactions = await transactionService.findByFilters(transactionFilters);
    return transactions.reduce((acc, t) => {
      if (t.type === Transaction.Type.REFERRAL) acc -= t.amount;
      else acc += t.amount;
      return acc;
    }, 0);
  }

  async getConclusionCount(start: Date, end: Date) {
    const transactionFilters: Common.GetByFilters<Transaction.Dto> = {
      filters: { createdAt: { $gte: start, $lte: end }, type: Transaction.Type.CONCLUSION },
      select: 'amount createdAt',
    };
    const transactions = await transactionService.findByFilters(transactionFilters);
    return transactions.reduce((acc, t) => acc + t.amount, 0);
  }
}

export default new AdminController();
