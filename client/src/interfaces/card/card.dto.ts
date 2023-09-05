import { TimestampDto } from '../common/index.dto';

export interface CardDto extends TimestampDto {
  user: string;
  payment: string;
  active: boolean;

  type: CardType;

  tinkoff: {
    RequestKey: string | null;
    CardId: string | null;
    ExpDate: string | null;
    Pan: string | null;
  };
}

export enum CardType {
  MASTERCARD = 'MASTERCARD',
  VISA = 'VISA',
  MIR = 'MIR',
  UNKNOWN = 'UNKNOWN',
}
