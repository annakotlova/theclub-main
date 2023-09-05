import { Review } from './review.dto';

export type CreateReviewDto = Pick<Review.Dto, 'rating' | 'description' | 'event' | 'user'>;
