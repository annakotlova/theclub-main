import { Common } from '@/interfaces/common.dto';

export interface UpdateSupportEventDto {
  _id: Common.BaseModel['_id'];
  selected: Array<Common.BaseModel['_id']>;
}
