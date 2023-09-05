import { Router } from 'express';

import controller from './transaction.controller';

import limiter from '@/middlewares/limiter';

const router = Router();

router.get('/transaction/list', limiter(60), controller.getList);

export default router;

/**
 * @swagger
 * /api/transaction/list:
 *  get:
 *    tags:
 *     - Transaction Module
 *    security:
 *     - cookieAccess: []
 *    summary: Получение списка транзакции пользователя по пагинации
 *    parameters:
 *     - name: user
 *       required: true
 *       in: query
 *       description: ID пользователя
 *       type: string
 *     - name: limit
 *       required: false
 *       in: query
 *       description: Кол-во элементов на странице
 *       type: string
 *       example: 20
 *     - name: page
 *       required: false
 *       in: query
 *       description: Страница
 *       type: string
 *       example: 1
 *    responses:
 *      200:
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/TransactionEntity'
 *                status:
 *                  type: boolean
 *                  default: true
 *                statusCode:
 *                  type: number
 *                  default: 200
 *                message:
 *                  type: string
 *                  default: null
 *      400:
 *        $ref: '#/components/responses/Conflict'
 *      401:
 *        $ref: '#/components/responses/Unauthorized'
 *      404:
 *        $ref: '#/components/responses/NotFound'
 */
