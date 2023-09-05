import { Common } from '@/interfaces/common.dto';
import { Notification } from './notification.dto';
import { User } from '@/modules/user/dto/user.dto';
import { Event } from '@/modules/event/dto/event.dto';

export interface CreateNotificationDto {
  event?: Common.BaseModel['_id'] | Event.Dto;
  users: Array<Common.BaseModel['_id']> | Array<User.Dto>;
  type: Notification.Type;
  meta?: Notification.Meta;
}
