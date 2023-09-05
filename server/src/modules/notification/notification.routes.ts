import { Router } from 'express';

import controller from './notification.controller';

import limiter from '@/middlewares/limiter';

const router = Router();

router.get('/notification/list', limiter(60), controller.getList);

router.patch('/notification/viewed', limiter(10), controller.updateViewed);

export default router;
