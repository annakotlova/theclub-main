import { Common } from '@/interfaces/common.dto';
import { User } from '@/modules/user/dto/user.dto';

export namespace Referral {
  export interface Dto extends Common.BaseModel {
    code: string;
    user: User.Dto;
    parent: Dto;
    members: Array<{
      active: boolean;
      viewed: boolean;
      member: Common.BaseModel['_id'];
    }>;

    amount: number;
    level: number;
  }

  export const Percent = [10, 5, 3];
}
