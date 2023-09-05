export namespace Softpay {
  export enum RequestMethod {
    CREATE_ORDER = '/api/v1/order',
    CREATE_CONCLUSION = '/api/payment/theclub',
    CONCLUSION_BIND = '/api/conclusion/bind',
    CONCLUSION_WITHDRAWAL = '/api/conclusion/withdrawal',
  }
  export enum StatusResponse {
    CONFIRMED = 'CONFIRMED',
    COMPLETED = 'COMPLETED',
    REJECTED = 'REJECTED',
    AUTHORIZED = 'AUTHORIZED',
  }
  export interface Response {
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
}
