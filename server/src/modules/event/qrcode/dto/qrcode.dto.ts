import { Common } from '@/interfaces/common.dto';
import { User } from '@/modules/user/dto/user.dto';
import { Event } from '@/modules/event/dto/event.dto';

export namespace QrCode {
  export interface Dto extends Common.BaseModel {
    support: User.Dto;
    member: User.Dto;
    event: Event.Dto;
    status: Status;
    code: string;
  }

  export enum Status {
    CREATED = 'CREATED',
    CONFIRMED = 'CONFIRMED',
    EXPIRED = 'EXPIRED',
  }
}
