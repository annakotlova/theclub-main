import { model, Schema } from 'mongoose';
import { User } from './dto/user.dto';

const users = new Schema<User.Dto>({
  name: { type: String, default: '' },
  login: { type: String, default: '' },
  email: { type: String, default: '' },
  about: { type: String, default: '' },
  birthday: { type: Date, default: null },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  role: { type: String, default: User.Role.USER, enum: User.Role },
  subjects: [{ type: String, enum: User.Subject }],
  avatar: { type: Schema.Types.ObjectId, ref: 'files' },
  number: { type: Number, default: 0 },

  activated: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

export default model('users', users);
