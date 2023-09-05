import { Common } from '@/interfaces/common.dto';
import { Event } from '@/modules/event/dto/event.dto';
import { User } from '@/modules/user/dto/user.dto';

export namespace Notification {
  export interface Dto extends Common.BaseModel {
    user: User.Dto;
    event?: Event.Dto | null;
    type: Type;
    viewed: boolean;
    meta: Meta;

    // Lean
    content: string;
  }
  export interface Meta {
    name?: string;
    place?: string;
    startedAt?: Date;
  }
  export enum Type {
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
}
