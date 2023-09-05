import { model, Schema } from 'mongoose';
import { Review } from './dto/review.dto';

const reviews = new Schema<Review.Dto>({
  event: { type: Schema.Types.ObjectId, ref: 'events' },
  user: { type: Schema.Types.ObjectId, ref: 'users' },

  rating: { type: Number, required: true },
  description: { type: String, default: '' },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

export default model('reviews', reviews);
