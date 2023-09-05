import { Common } from '@/interfaces/common.dto';

export namespace Review {
  export interface Dto extends Common.BaseModel {
    event: Common.BaseModel['_id'];
    user: Common.BaseModel['_id'];
    rating: number;
    description: string;
  }
}
