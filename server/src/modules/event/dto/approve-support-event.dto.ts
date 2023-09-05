import { Common } from '@/interfaces/common.dto';

export interface ApproveSupportEventDto {
  _id: Common.BaseModel['_id'];
  status: boolean;
}
