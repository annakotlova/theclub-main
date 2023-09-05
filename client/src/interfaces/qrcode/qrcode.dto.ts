import { TimestampDto } from '../common/index.dto';
import { EventDto } from '../event/event.dto';
import { UserDto } from '../user/user.dto';

export interface QrCodeDto extends TimestampDto {
  support: UserDto;
  member: UserDto;
  event: EventDto;
  status: QrCodeStatus;
  code: string;
}

export enum QrCodeStatus {
  CREATED = 'CREATED',
  CONFIRMED = 'CONFIRMED',
  EXPIRED = 'EXPIRED',
}
