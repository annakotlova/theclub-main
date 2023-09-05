import { TimestampDto } from '../common/index.dto';
import { EventDto } from '../event/event.dto';

export interface NotificationDto extends TimestampDto {
  user: string;
  event: EventDto;
  type: NotificationType;
  viewed: boolean;
  meta: NotificationMeta;

  // Lean
  content: string;
}

export interface NotificationMeta {
  name?: string;
  place?: string;
  startedAt?: Date;
  approved?: boolean;
}

export enum NotificationType {
  DEFAULT = 'DEFAULT',
  WARNING = 'WARNING',

  WAITING_LIST = 'WAITING_LIST',
  SUPPORT_SELECT = 'SUPPORT_SELECT',
  SUPPORT_JOIN = 'SUPPORT_JOIN',
  SUPPORT_LEAVE = 'SUPPORT_LEAVE',

  EVENT_LEAVE = 'EVENT_LEAVE',
  EVENT_REVIEW = 'EVENT_REVIEW',
  EVENT_BLOCKED = 'EVENT_BLOCKED',
  EVENT_CANCELED = 'EVENT_CANCELED',
  EVENT_UNBLOCKED = 'EVENT_UNBLOCKED',
  EVENT_UPDATE_NAME = 'EVENT_UPDATE_NAME',
  EVENT_UPDATE_DATE = 'EVENT_UPDATE_DATE',
  EVENT_UPDATE_PLACE = 'EVENT_UPDATE_PLACE',
  EVENT_CANCELED_MEMBER = 'EVENT_CANCELED_MEMBER',
}
