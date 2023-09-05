import { Common } from '@/interfaces/common.dto';
import { Transaction } from './transaction.dto';

export type CreateTransactionDto = Pick<
  Transaction.Dto,
  'amount' | 'payment' | 'order' | 'pan' | 'type' | 'status'
> & { user: Common.BaseModel['_id'] };
