import eventEntity from './event.entity';

import { Event } from './dto/event.dto';
import { Common } from '@/interfaces/common.dto';
import { CreateEventDto } from './dto/create-event.dto';

class EventService {
  async findByFilters(f: Common.GetByFilters<Event.Dto>) {
    const e = eventEntity.find(f.filters, null, f.options);
    if (f.select) e.select(f.select);
    if (f.populate) e.populate(f.populate);
    if (f.lean) e.lean();
    return e;
  }

  async findOneByFilters(f: Common.GetByFilters<Event.Dto>) {
    const e = eventEntity.findOne(f.filters, null);
    if (f.select) e.select(f.select);
    if (f.populate) e.populate(f.populate);
    if (f.lean) e.lean();
    return e;
  }

  async exists({ filters }: Common.Filters<Event.Dto>) {
    return eventEntity.exists(filters);
  }

  async count({ filters }: Common.Filters<Event.Dto>) {
    return eventEntity.countDocuments(filters);
  }

  async create(dto: CreateEventDto) {
    return eventEntity.create(dto);
  }

  async update({ filters, update, updated, select }: Common.UpdateByFilters<Event.Dto>) {
    const e = eventEntity.findOneAndUpdate(filters, update, { new: updated });
    if (select) e.select(select);
    return e.lean();
  }

  async updateMany({ filters, update }: Common.UpdateByFilters<Event.Dto>) {
    return eventEntity.updateMany(filters, update);
  }

  async updateDoc({ doc, update }: Common.UpdateDoc<Event.Dto>) {
    return doc.updateOne(update, { new: true });
  }

  async delete({ filters }: Common.Filters<Event.Dto>) {
    return eventEntity.findOneAndDelete(filters);
  }
}

export default new EventService();
