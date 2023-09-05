import { model, Schema } from 'mongoose';
import { Notification } from './dto/notification.dto';

const notifications = new Schema<Notification.Dto>({
  user: { type: Schema.Types.ObjectId, ref: 'users' },
  event: { type: Schema.Types.ObjectId, ref: 'events' },
  type: { type: String, enum: Notification.Type, required: true },
  viewed: { type: Boolean, default: false },
  content: { type: String, required: false },
  meta: {
    _id: false,
    name: { type: String, required: false },
    place: { type: String, required: false },
    startedAt: { type: Date, required: false },
    approved: { type: Boolean, required: false },
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

export default model('notifications', notifications);
