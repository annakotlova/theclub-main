import { model, Schema } from 'mongoose';
import { Transaction } from './dto/transaction.dto';

const transactions = new Schema<Transaction.Dto>({
  user: { type: Schema.Types.ObjectId, ref: 'users' },
  payment: { type: Schema.Types.ObjectId, ref: 'payments' },

  pan: { type: String, default: '' },
  order: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, default: Transaction.Status.CREATED, enum: Transaction.Status },
  type: { type: String, required: true, enum: Transaction.Type },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

export default model('transactions', transactions);
