import { model, Schema } from 'mongoose';
import { Referral } from './dto/referral.dto';

const referrals = new Schema<Referral.Dto>({
  code: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'users' },

  parent: { type: Schema.Types.ObjectId, ref: 'referrals' },
  members: [
    {
      _id: false,
      active: { type: Boolean, default: false },
      viewed: { type: Boolean, default: false },
      member: { type: Schema.Types.ObjectId, ref: 'users' },
    },
  ],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

export default model('referrals', referrals);
