import reviewEntity from './review.entity';

import { Review } from './dto/review.dto';
import { Common } from '@/interfaces/common.dto';
import { CreateReviewDto } from './dto/create-review.dto';

class ReviewService {
  async findByFilters(f: Common.GetByFilters<Review.Dto>) {
    const e = reviewEntity.find(f.filters, null, f.options);
    if (f.select) e.select(f.select);
    if (f.populate) e.populate(f.populate);
    if (f.lean) e.lean();
    return e;
  }

  async findOneByFilters(f: Common.GetByFilters<Review.Dto>) {
    const e = reviewEntity.findOne(f.filters, null);
    if (f.select) e.select(f.select);
    if (f.populate) e.populate(f.populate);
    if (f.lean) e.lean();
    return e;
  }

  async exists({ filters }: Common.Filters<Review.Dto>) {
    return reviewEntity.exists(filters);
  }

  async count({ filters }: Common.Filters<Review.Dto>) {
    return reviewEntity.countDocuments(filters);
  }

  async create(dto: CreateReviewDto) {
    const exist = await this.exists({ filters: { event: dto.event, user: dto.user } });
    if (exist) return false;

    return reviewEntity.create(dto);
  }

  async update({ filters, update, updated }: Common.UpdateByFilters<Review.Dto>) {
    return reviewEntity.findOneAndUpdate(filters, update, { new: updated }).lean();
  }

  async updateMany({ filters, update }: Common.UpdateByFilters<Review.Dto>) {
    return reviewEntity.updateMany(filters, update);
  }

  async updateDoc({ doc, update }: Common.UpdateDoc<Review.Dto>) {
    return doc.updateOne(update, { new: true });
  }

  async delete({ filters }: Common.Filters<Review.Dto>) {
    return reviewEntity.findOneAndDelete(filters);
  }

  async deleteMany({ filters }: Common.Filters<Review.Dto>) {
    return reviewEntity.deleteMany(filters);
  }
}

export default new ReviewService();
