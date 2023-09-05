import { model, Schema } from 'mongoose';
import { Payment } from './dto/payment.dto';

const payments = new Schema<Payment.Dto>({
  user: { type: Schema.Types.ObjectId, ref: 'users' },
  card: { type: Schema.Types.ObjectId, ref: 'cards' },

  trial: { type: Boolean, default: false },
  cancel: { type: Boolean, default: false },

  balance: { type: Number, required: true },
  balanceHash: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
  subscriptionAt: { type: Date, default: Date.now },
});

export default model('payments', payments);
