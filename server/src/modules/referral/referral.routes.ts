import { Router } from 'express';

import controller from './referral.controller';

import limiter from '@/middlewares/limiter';

const router = Router();

router.get('/referral/list', limiter(60), controller.getList);
router.get('/referral', limiter(60), controller.getItem);

router.get('/referral/validate', limiter(60), controller.validate);

router.patch('/referral/viewed', limiter(60), controller.viewed);

export default router;

/**
 * @swagger
 * /api/referral:
 *  get:
 *    tags:
 *     - Referral Module
 *    security:
 *     - cookieAccess: []
 *    summary: Получение сущности реферала пользователя
 *    parameters:
 *     - name: limit
 *       required: false
 *       in: query
 *       description: Кол-во рефералов на странице
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
 *                  $ref: '#/components/schemas/ReferralEntity'
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