import axios, { Axios, AxiosError } from 'axios';
import { TinkoffCredit } from './dto/tinkoff-credit.dto';
import { Payment } from '@/modules/payment/dto/payment.dto';

class TinkoffCreditAPI {
  axios: Axios;
  shopId: string;
  showcaseId: string;
  period: {
    SIX: string;
    THREE: string;
  }
  init() {
    this.axios = axios.create({ baseURL: String(process.env.TINKOFF_CREDIT_API) });
    this.shopId = String(process.env.TINKOFF_CREDIT_SHOP);
    this.showcaseId = String(process.env.TINKOFF_CREDIT_SHOWCASE);
    this.period = {
      THREE: process.env.TINKOFF_CREDIT_THREE || '',
      SIX: process.env.TINKOFF_CREDIT_SIX || '',
    }
    console.log('Tinkoff Credit Module: ✅');
  }
  generateTinkoffData() {
    return {
      shopId: this.shopId,
      showcaseId: this.showcaseId,
    };
  }
  async createOrder(
    dto: TinkoffCredit.CreateOrderRequestDto,
    period: Payment.Credit,
    trial = false,
  ): Promise<TinkoffCredit.CreateOrderResponseDto> {
    try {
      const price = Payment.TariffPrice[dto.tariff] - (trial ? 5000 : 0);
      
      const main = String(process.env.MAIN_URL);
      const shopData = this.generateTinkoffData();
      const itemData = {
        name: Payment.TariffName[dto.tariff],
        price,
        quantity: 1,
      };
      const name = dto.user?.name?.split(' ') as string[];
      const orderData = {
        promoCode: this.period[period] || 'installment_0_0_6_6,5',
        orderNumber: dto.order,
        sum: price,
        values: {
          contact: {
            email: dto.user?.email || '',
            mobilePhone: dto.user?.phone?.replace(/[^\w\s!?]/g, '')?.substring(1) || '',
            fio: {
              lastName: name[0] || '',
              firstName: name[1] || '',
              middleName: name[2] || '',
            },
          },
        },
        items: [itemData],
      };
      const urlData = {
        failURL: main + '/payment/rejected',
        successURL: main + '/payment/confirmed',
        returnURL: main + '/payment',
        webhookURL: main + '/api/payment/notification/credit',
      };
      const { data } = await this.axios.post(TinkoffCredit.RequestMethod.CREATE_ORDER, {
        ...urlData,
        ...shopData,
        ...orderData,
      });
      return { status: true, data };
    } catch (err) {
      if (err instanceof AxiosError)
      console.log(err.response);
      return { status: false, data: null };
    }
  }
}

export default new TinkoffCreditAPI();
