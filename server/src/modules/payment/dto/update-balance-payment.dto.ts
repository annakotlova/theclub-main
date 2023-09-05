import { FilterQuery } from 'mongoose';
import { Payment } from './payment.dto';

export interface UpdateBalancePaymentDto {
  filters: FilterQuery<Payment.Dto>;
  amount: number;
  inc: 1 | -1;
}
