import { Transaction } from './transaction.dto';

export interface GetTransactionListDto {
  started?: string;
  type?: Transaction.Type;
}

/**
 * @swagger
 * components:
 *  schemas:
 *    GetTransactionListDto:
 *      description: Query запроса /api/transaction/list
 *      type: object
 *      properties:
 *        type:
 *          $ref: '#/components/schemas/TransactionTypeEnum'
 */