import { Router } from 'express';

import controller from './event.controller';

import limiter from '@/middlewares/limiter';

const router = Router();

router.get('/event/list', limiter(60), controller.getList);
router.get('/event/list/expired', limiter(60), controller.getExpiredList);
router.get('/event/list/joined', limiter(60), controller.getJoinedList);
router.get('/event/:_id', limiter(60), controller.getItem);
router.get('/event/creator/:_id', limiter(60), controller.getCreatorItem);
router.get('/event/member/list', limiter(60), controller.getMemberList);

router.post('/event', limiter(10), controller.create);

router.patch('/event', limiter(10), controller.update);
router.patch('/event/support', limiter(10), controller.updateSupport);
router.patch('/event/support/approve', limiter(10), controller.approveSupport);
router.patch('/event/action', limiter(10), controller.action);
router.patch('/event/action/waiting', limiter(10), controller.actionWaiting);
router.patch('/event/block', limiter(10), controller.block);
router.patch('/event/unblock', limiter(10), controller.unblock);
router.patch('/event/cancel', limiter(10), controller.cancel);

router.delete('/event/:_id', limiter(20), controller.delete);

export default router;

/**
 * @swagger
 * /api/event/list:
 *  get:
 *    tags:
 *     - Event Module
 *    security:
 *     - cookieAccess: []
 *    summary: Получение списка мероприятий платформы по пагинации
 *    parameters:
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
 *                    $ref: '#/components/schemas/EventEntity'
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
