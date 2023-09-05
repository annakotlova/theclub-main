import { TimestampDto } from '../common/index.dto';
import { UserDto } from '../user/user.dto';

export interface ReferralDto extends TimestampDto {
  code: string;
  user: string;
  members: Array<{
    active: boolean;
    viewed: boolean;
    member: UserDto;
  }>;
}
