import { Request, Response } from 'express';

import notificationService from './notification.service';

import { Common } from '@/interfaces/common.dto';
import { Notification } from './dto/notification.dto';
import { UpdateViewedNotificationDto } from './dto/update-viewed-notification.dto';

import { Converter, Access } from '@/decorators';

import response, { ErrorHandler } from '@/utils/response';

class NotificationController {
  @Access()
  @ErrorHandler()
  async getList(_: Request, res: Response) {
    const user = res.locals.user._id;
    const options = { page: 1, limit: 50, sort: { _id: -1 } };

    const notificationFilters: Common.GetByFilters<Notification.Dto> = {
      filters: { user },
      options,
      populate: { path: 'event', select: 'name status' },
      lean: true,
    };
    const notifications = await notificationService.findByFilters(notificationFilters);
    for (const item of notifications) notificationService.getContent(item);

    response.ok(res, null, notifications);
  }

  @Access()
  @Converter('notification_viewed')
  @ErrorHandler()
  async updateViewed(req: Request, res: Response) {
    const dto = req.body as UpdateViewedNotificationDto;

    const notificationFilters: Common.UpdateByFilters<Notification.Dto> = {
      filters: { _id: { $in: dto.list } },
      update: { viewed: true, updatedAt: Date.now() },
      updated: true,
      select: 'viewed',
    };
    await notificationService.updateMany(notificationFilters);
    response.ok(res);
  }
}

export default new NotificationController();
