import { model, Schema } from 'mongoose';
import { Card } from './dto/card.dto';

const cards = new Schema<Card.Dto>({
  user: { type: Schema.Types.ObjectId, ref: 'users' },
  payment: { type: Schema.Types.ObjectId, ref: 'payments' },
  type: { type: String, enum: Card.Type, default: Card.Type.UNKNOWN },
  active: { type: Boolean, default: false },

  tinkoff: {
    _id: false,
    RequestKey: { type: String, default: null },
    CardId: { type: String, default: null },
    Pan: { type: String, default: null },
    ExpDate: { type: String, default: null },
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

export default model('cards', cards);
