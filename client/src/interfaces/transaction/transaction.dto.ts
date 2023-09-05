import { TimestampDto } from '../common/index.dto';

export interface TransactionDto extends TimestampDto {
  user: string;
  payment: string;
  amount: number;
  pan?: string;
  order: string;
  status: TransactionStatus;
  type: TransactionType;
}
export enum TransactionStatus {
  CREATED = 'CREATED',
  PROCESS = 'PROCESS',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}
export enum TransactionType {
  PAYMENT = 'PAYMENT',
  REFERRAL = 'REFERRAL',
  CONCLUSION = 'CONCLUSION',
}

export enum TransactionStatusName {
  CREATED = 'Создан',
  PROCESS = 'В процессе',
  REJECTED = 'Ошибка',
  COMPLETED = 'Успешно',
}
