import { model, Schema } from 'mongoose';
import { QrCode } from './dto/qrcode.dto';

const qrcodes = new Schema<QrCode.Dto>({
  support: { type: Schema.Types.ObjectId, ref: 'users' },
  member: { type: Schema.Types.ObjectId, ref: 'users' },
  event: { type: Schema.Types.ObjectId, ref: 'events' },
  status: { type: String, enum: QrCode.Status, default: QrCode.Status.CREATED },
  code: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

export default model('qrcodes', qrcodes);
