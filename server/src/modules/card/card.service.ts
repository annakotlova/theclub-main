import cardEntity from './card.entity';

import { Card } from './dto/card.dto';
import { Common } from '@/interfaces/common.dto';
import { CreateCardDto } from './dto/create-card.dto';

class CardService {
  async findByFilters(f: Common.GetByFilters<Card.Dto>) {
    const e = cardEntity.find(f.filters, null, f.options);
    if (f.select) e.select(f.select);
    if (f.populate) e.populate(f.populate);
    if (f.lean) e.lean();
    return e;
  }

  async findOneByFilters(f: Common.GetByFilters<Card.Dto>) {
    const e = cardEntity.findOne(f.filters, null);
    if (f.select) e.select(f.select);
    if (f.populate) e.populate(f.populate);
    if (f.lean) e.lean();
    return e;
  }

  async exists({ filters }: Common.Filters<Card.Dto>) {
    return cardEntity.exists(filters);
  }

  async count({ filters }: Common.Filters<Card.Dto>) {
    return cardEntity.countDocuments(filters);
  }

  async create(dto: CreateCardDto) {
    return cardEntity.create(dto);
  }

  async update({ filters, update, updated, select }: Common.UpdateByFilters<Card.Dto>) {
    const e = cardEntity.findOneAndUpdate(filters, update, { new: updated });
    if (select) e.select(select);
    return e.lean();
  }

  async updateMany({ filters, update }: Common.UpdateByFilters<Card.Dto>) {
    return cardEntity.updateMany(filters, update);
  }

  async updateDoc({ doc, update }: Common.UpdateDoc<Card.Dto>) {
    return doc.updateOne(update, { new: true });
  }

  async delete({ filters }: Common.Filters<Card.Dto>) {
    return cardEntity.findOneAndDelete(filters);
  }

  async deleteMany({ filters }: Common.Filters<Card.Dto>) {
    return cardEntity.deleteMany(filters);
  }
}

export default new CardService();
