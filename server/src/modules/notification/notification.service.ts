import notificationEntity from './notification.entity';
import notificationConstants from './notification.constants';

import { Common } from '@/interfaces/common.dto';
import { Notification } from './dto/notification.dto';
import { SocketDto } from '../common/socket/dto/socket.dto';
import { CreateNotificationDto } from './dto/create-notification.dto';

import socket from '../common/socket';

class NotificationService {
  async findByFilters(f: Common.GetByFilters<Notification.Dto>) {
    const e = notificationEntity.find(f.filters, null, f.options);
    if (f.select) e.select(f.select);
    if (f.populate) e.populate(f.populate);
    if (f.lean) e.lean();
    return e;
  }

  async findOneByFilters(f: Common.GetByFilters<Notification.Dto>) {
    const e = notificationEntity.findOne(f.filters, null);
    if (f.select) e.select(f.select);
    if (f.populate) e.populate(f.populate);
    if (f.lean) e.lean();
    return e;
  }

  async exists({ filters }: Common.Filters<Notification.Dto>) {
    return notificationEntity.exists(filters);
  }

  async count({ filters }: Common.Filters<Notification.Dto>) {
    return notificationEntity.countDocuments(filters);
  }

  async create(dto: CreateNotificationDto) {
    if (!dto.users.length) return false;
    const dtos = dto.users.map((user) => ({
      event: dto.event || null,
      user,
      type: dto.type,
      meta: dto.meta,
    }));

    this.deleteOld(dto);

    const created = await notificationEntity.create(dtos);
    const notificationFilters: Common.GetByFilters<Notification.Dto> = {
      filters: { _id: { $in: created.map((c) => c._id) } },
      populate: { path: 'event', select: 'name status' },
      lean: true,
    };
    const notifications = await this.findByFilters(notificationFilters);
    for (const notification of notifications) {
      this.getContent(notification);
      socket.actions.notification(notification, SocketDto.NotificationAction.create);
    }
    return notifications;
  }

  async update(f: Common.UpdateByFilters<Notification.Dto>) {
    const e = notificationEntity.findOneAndUpdate(f.filters, f.update, { new: f.updated });
    if (f.select) e.select(f.select);
    return e.lean();
  }

  async updateDoc({ doc, update }: Common.UpdateDoc<Notification.Dto>) {
    return doc.updateOne(update, { new: true });
  }

  async updateMany({ filters, update }: Common.UpdateByFilters<Notification.Dto>) {
    return notificationEntity.updateMany(filters, update);
  }

  async delete({ filters }: Common.Filters<Notification.Dto>) {
    return notificationEntity.findOneAndDelete(filters);
  }

  async deleteMany({ filters }: Common.Filters<Notification.Dto>) {
    return notificationEntity.deleteMany(filters);
  }

  async deleteOld(dto: CreateNotificationDto) {
    const deleted = dto.users
      .map((user) => ({
        event: dto.event || null,
        type: dto.type,
        user,
      }))
      .filter((n) => n.event);

    for (const notification of deleted) await notificationEntity.deleteOne(notification);

    for (const notification of deleted)
      socket.actions.notification(notification, SocketDto.NotificationAction.delete);
  }

  getContent(item: Notification.Dto) {
    const type = Notification.Type;
    if (type.EVENT_UPDATE_DATE === item.type && item.meta.name && item.meta.startedAt)
      item.content = notificationConstants.types[item.type](
        item.meta.name,
        String(item.meta.startedAt),
      );
    else if (type.EVENT_UPDATE_NAME === item.type && item.meta.name && item.event?.name)
      item.content = notificationConstants.types[item.type](item.meta.name, item.event?.name);
    else if (type.EVENT_UPDATE_PLACE === item.type && item.meta.name && item.meta.place)
      item.content = notificationConstants.types[item.type](item.meta.name, item.meta.place);
    else item.content = notificationConstants.types[item.type](item.meta.name || '', '');
  }
}

export default new NotificationService();
