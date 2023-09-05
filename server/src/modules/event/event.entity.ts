import { model, Schema } from 'mongoose';
import { Event } from './dto/event.dto';
import { User } from '../user/dto/user.dto';

const events = new Schema<Event.Dto>({
  name: { type: String, required: true },
  content: { type: String, required: true },
  link: { type: String, default: '' },
  place: { type: String, default: '' },
  additional: { type: String, default: '' },
  
  cover: { type: Schema.Types.ObjectId, ref: 'files' },

  format: { type: String, required: true, enum: Event.Format },
  subject: { type: String, required: true, enum: User.Subject },
  category: { type: String, required: true, enum: Event.Category },
  organizer: { type: String, required: true, enum: Event.Organizer },

  minMembers: { type: Number, required: true },
  maxMembers: { type: Number, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'users' }],
  membersLength: { type: Number, default: 0 },
  waiting: [{ type: Schema.Types.ObjectId, ref: 'users' }],
  supports: [{
    _id: false,
    approved: { type: Boolean, default: false },
    member: { type: Schema.Types.ObjectId, ref: 'users' },
  }],
  creator: { type: Schema.Types.ObjectId, ref: 'users' },

  status: { type: String, default: Event.Status.CREATED, enum: Event.Status },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },

  startedAt: { type: Date, required: true },
  endedAt: { type: Date, required: true },
});

export default model('events', events);
