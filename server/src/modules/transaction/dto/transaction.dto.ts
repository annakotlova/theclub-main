import { Common } from '@/interfaces/common.dto';
import { User } from '@/modules/user/dto/user.dto';

export namespace Transaction {
  export interface Dto extends Common.BaseModel {
    user: User.Dto;
    payment: Common.BaseModel['_id'];
    amount: number;
    pan?: string;
    order: string;
    status: Status;
    type: Type;
  }
  export enum Status {
    CREATED = 'CREATED',
    PROCESS = 'PROCESS',
    REJECTED = 'REJECTED',
    COMPLETED = 'COMPLETED',
  }
  export enum Type {
    CREDIT = 'CREDIT',
    RESERVE = 'RESERVE',
    PAYMENT = 'PAYMENT',
    PAYMENT_BALANCE = 'PAYMENT_BALANCE',
    REFERRAL = 'REFERRAL',
    CONCLUSION = 'CONCLUSION',
  }
}

/**
 * @swagger
 * components:
 *  schemas:
 *    TransactionEntity:
 *      description: Сущность транзакции
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          description: ID транзакции
 *        user:
 *          type: string
 *          description: ID пользователя
 *        payment:
 *          type: string
 *          description: ID платежных данных
 *        status:
 *          $ref: '#/components/schemas/TransactionStatusEnum'
 *        type:
 *          $ref: '#/components/schemas/TransactionTypeEnum'
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *    TransactionStatusEnum:
 *      type: string
 *      enum:
 *        - CREATED
 *        - PROCESS
 *        - REJECTED
 *        - COMPLETED
 *    TransactionTypeEnum:
 *      type: string
 *      enum:
 *        - CREDIT
 *        - RESERVE
 *        - PAYMENT
 *        - REFERRAL
 *        - CONCLUSION
 */
