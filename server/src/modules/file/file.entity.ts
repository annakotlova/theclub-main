import { model, Schema } from 'mongoose';
import { File } from './dto/file.dto';

const files = new Schema<File.Dto>({
  type: { type: String, required: true, enum: File.Type },
  src: { type: String, required: true },
  name: { type: String, default: '' },
  size: { type: Number, default: 0 },
  meta: { type: Object, default: { orientation: '-1' } },
  mimetype: { type: String, default: '' },
  cover: { type: String, default: '' },

  creator: { type: Schema.Types.ObjectId, ref: 'users' },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: new Date(0) },
});

export default model('files', files);
