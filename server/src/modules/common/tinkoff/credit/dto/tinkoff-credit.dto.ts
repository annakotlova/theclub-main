import { Payment } from '@/modules/payment/dto/payment.dto';
import { User } from '@/modules/user/dto/user.dto';

export namespace TinkoffCredit {
  export interface CreateOrderRequestDto {
    order: string;
    tariff: Payment.Tariff;
    user?: User.Dto;
  }
  export interface Response {
    status: boolean;
    success?: boolean;
    message?: string;
  }
  export interface CreateOrderResponseDto extends Response {
    data: { id: string; link: string } | null;
  }
  export enum RequestMethod {
    CREATE_ORDER = '/api/partners/v2/orders/create',
    CREATE_ORDER_DEMO = '/api/online/application/create-demo',
  }
}
