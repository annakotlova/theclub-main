import { Common } from '@/interfaces/common.dto';

export interface FixPaymentDto {
  user: Common.BaseModel['_id'];
  amount: number;
  password: string;
}
