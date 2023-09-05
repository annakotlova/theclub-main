export interface WithdrawalPaymentDto {
  amount: number;
}

/**
 * @swagger
 * components:
 *  schemas:
 *    WithdrawalPaymentDto:
 *      description: Тело запроса /api/payment/withdrawal
 *      type: object
 *      properties:
 *        amount:
 *          type: number
 *          description: Сумма вывода в рублях
 */