import { TimestampDto } from '../common/index.dto';
import { CardDto } from '../card/card.dto';
import { UserDto } from '../user/user.dto';

export interface PaymentDto extends TimestampDto {
  user: UserDto;
  card: CardDto | null;

  trial: boolean;
  cancel: boolean;

  balance: number;
  balanceHash: string;

  subscriptionAt: Date;
}

export enum PaymentTariffType {
  CASH = 'CASH',
  CREDIT = 'CREDIT',
  RESERVE = 'RESERVE',
  BALANCE = 'BALANCE',
}

export enum PaymentCreditPeriod {
  THREE = 'THREE',
  SIX = 'SIX',
}

export enum PaymentTariff {
  HALFYEAR = 'HALFYEAR',
  YEAR = 'YEAR',
}

export enum PaymentTariffPrice {
  HALFYEAR = 35_000,
  YEAR = 65_000,
}

export enum PaymentTariffName {
  HALFYEAR = '6 Месяцев',
  YEAR = '12 Месяцев',
}
