import { Request, Response } from 'express';

import reviewService from './review.service';
import eventService from '../event/event.service';
import reviewConstants from './review.constants';

import { Review } from './dto/review.dto';
import { User } from '../user/dto/user.dto';
import { Event } from '../event/dto/event.dto';
import { Common } from '@/interfaces/common.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { GetListReviewDto } from './dto/get-list-review.dto';

import { Converter, VerifyRoles, Access } from '@/decorators';

import response, { ErrorHandler } from '@/utils/response';

class ReviewController {
  @Access()
  @VerifyRoles(User.Role.ADMIN)
  @Converter('review_get_list')
  @ErrorHandler()
  async getList(req: Request, res: Response) {
    const query = req.query as GetListReviewDto;

    const reviewFilters: Common.GetByFilters<Review.Dto> = {
      filters: { event: query.event },
      populate: {
        path: 'user',
        select: 'name phone avatar',
        populate: { path: 'avatar', select: 'src cover type' },
      },
    };
    const reviews = await reviewService.findByFilters(reviewFilters);
    response.ok(res, null, reviews);
  }

  @Access()
  @Converter('review_create')
  @ErrorHandler()
  async create(req: Request, res: Response) {
    const dto = req.body as CreateReviewDto;
    dto.user = res.locals.user._id;

    const eventFilters: Common.GetByFilters<Event.Dto> = {
      filters: { _id: dto.event, status: Event.Status.FINISHED },
    };
    const event = await eventService.exists(eventFilters);
    if (!event) return response.badRequest(res, reviewConstants.EVENT_NOT_EXIST);

    if (dto.rating < 1 || dto.rating > 5)
      return response.badRequest(res, reviewConstants.RATING_ERROR);

    const review = await reviewService.create(dto);
    if (!review) return response.badRequest(res, reviewConstants.EXIST);

    response.created(res, null, review);
  }
}

export default new ReviewController();
