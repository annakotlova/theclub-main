import { Payment } from './payment.dto';

export interface InitialPaymentDto {
  tariff: Payment.Tariff;
  type: Payment.TariffType;
  period?: Payment.Credit;
}
