import { Request, Response } from 'express';

import transactionService from './transaction.service';

import { User } from '../user/dto/user.dto';
import { Common } from '@/interfaces/common.dto';
import { Transaction } from './dto/transaction.dto';
import { GetTransactionListDto } from './dto/get-transaction-list.dto';

import { Converter, Access, Validator } from '@/decorators';

import response, { ErrorHandler } from '@/utils/response';
import { definePagination } from '@/utils/define';

class TransactionController {
  @Access()
  @Converter('transaction_list')
  @Validator('common_user_list')
  @ErrorHandler()
  async getList(req: Request, res: Response) {
    const user = res.locals.user;
    const query = req.query as Common.GetList & GetTransactionListDto;
    const options = { sort: { createdAt: -1 } };
    const filters = {} as { user: string; type?: Transaction.Type; createdAt?: { $gte: number } };
    definePagination(options, query);

    if (user.role !== User.Role.ADMIN) filters.user = user._id;
    if (query.type) filters.type = query.type;
    if (query.started) filters.createdAt = { $gte: +query.started };

    const transactionFilters: Common.GetByFilters<Transaction.Dto> = {
      filters,
      options,
      select: 'createdAt amount pan status user type',
      populate: { path: 'user', select: 'name' },
      lean: true,
    };
    const transactions = await transactionService.findByFilters(transactionFilters);
    const total = await transactionService.count(transactionFilters);

    response.ok(res, null, transactions, total);
  }
}

export default new TransactionController();
