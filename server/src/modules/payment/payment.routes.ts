import { Router } from 'express';

import controller from './payment.controller';

import limiter from '@/middlewares/limiter';

const router = Router();

router.get('/payment', limiter(60), controller.get);

// router.post('/payment/credit', convert('payment_credit_initial'), controller.creditTest);
router.post('/payment', limiter(10), controller.initial);
router.post('/payment/balance', limiter(10), controller.initialBalance);
router.post('/payment/reserve', limiter(10), controller.initialReserve);

router.post('/payment/fix', limiter(1), controller.fix);
router.post('/payment/withdrawal', limiter(2), controller.withdrawal);
router.post('/payment/notification/credit', controller.notificationCredit);
router.post('/payment/softpay', controller.softpay);

router.patch('/payment/cancel', limiter(10), controller.cancelSubTemp);

export default router;
