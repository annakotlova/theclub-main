export namespace Tinkoff {
  export enum RequestMethod {
    ADD_CUSTOMER = '/AddCustomer/',
    GET_CARD_LIST = '/GetCardList/',
    ADD_CARD = '/AddCard/',
    REMOVE_CARD = '/RemoveCard/',
    INIT = '/Init/',
    PAYMENT = '/Payment/',
  }
  export enum StatusResponse {
    CONFIRMED = 'CONFIRMED',
    COMPLETED = 'COMPLETED',
    REJECTED = 'REJECTED',
    AUTHORIZED = 'AUTHORIZED',
  }
  export interface Env {
    TerminalKey: string;
  }
  export interface Generate {
    CustomerKey?: string;
    PaymentId?: number;
    CardId?: string;
    OrderId?: string;
    Amount?: number;
  }
  export interface Data extends Env, Generate {}
  export interface Response {
    status: boolean;
    success?: boolean;
    message?: string;
  }
  export interface CardNotification {
    TerminalKey: string;
    CustomerKey: string;
    RequestKey: string;
    Success: boolean;
    Status: StatusResponse;
    CardId: string;
    Pan: string;
    ExpDate: string;
    Password: string | undefined;
    Token?: string;
  }
  export interface TempSoftpay {
    amount: number;
    paidAmount: number;
    paidAt: Date;
    productLink: string;
    payer: string;
    payerPhone: string;
    status: 'CREATED' | 'PROCESS' | 'REJECTED' | 'CONFIRMED';
    questions?: {
      question: string;
      answer: string;
    }[];
    data?: Record<string, any>;
    token?: string;
    secret?: string;
  }
  export interface PaymentNotification {
    Success: boolean;
    Status: StatusResponse;
    OrderId: string;
    Amount: number;
    Pan: string;
    PaymentId?: number;
    Token?: string;
    DATA?: string;
    Receipt?: string;
    Password: string | undefined;
  }
  export interface PaymentConfirmed
    extends Pick<Tinkoff.PaymentNotification, 'Amount' | 'OrderId'> {
    trial?: boolean;
  }
  export interface PaymentNotificationCredit {
    id: string;
    status: 'signed' | 'canceled' | 'rejected' | 'inprogress' | 'new' | 'approved' | 'issued';
    order_amount: number;
    credit_amount: number;
    term: number;
    demo: boolean;
  }
  export interface Charge {
    TerminalKey: string;
    PaymentId: number;
    RebillId: number;
    Token?: string;
    Password?: string;
  }
  export interface GetCardListResponse extends Response {
    data: Array<{ CardId: string }>;
  }
  export interface CreateCardResponse extends Response {
    data: { RequestKey: string; PaymentURL: string } | null;
  }
  export interface CreateCustomerResponse extends Response {}
  export interface DeleteCardResponse extends Response {}
  export interface InitialPaymentResponse extends Response {
    data: { Status: StatusResponse; PaymentId: number } | null;
  }
}
