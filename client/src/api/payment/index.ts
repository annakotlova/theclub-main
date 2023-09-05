import { ApiWrapper } from '..';
import { Response } from '@/interfaces/common/index.dto';
import {
  PaymentCreditPeriod,
  PaymentDto,
  PaymentTariff,
  PaymentTariffType,
} from '@/interfaces/payment/payment.dto';

class PaymentAPI extends ApiWrapper {
  constructor() {
    super('/payment', true);
  }
  /**
   * Получение платежных данных
   */
  async getItem(): Response<PaymentDto> {
    return await this.get('');
  }
  /**
   * Инициализация плажета
   */
  async initial(
    tariff: PaymentTariff,
    type: PaymentTariffType,
    period?: PaymentCreditPeriod,
  ): Response<{ url: string }> {
    return await this.post('', { tariff, type, period });
  }
  /**
   * Инициализация остаточного плажета
   */
  async initialReserve(type: PaymentTariffType): Response<{ url: string }> {
    return await this.post('/reserve', { type });
  }
  /**
   * Инициализация плажета с баланса
   */
  async initialBalance(tariff: PaymentTariff): Response<{ url: string }> {
    return await this.post('/balance', { tariff });
  }
}
export default new PaymentAPI();
