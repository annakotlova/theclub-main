import { Router } from 'express';

import controller from './review.controller';

import limiter from '@/middlewares/limiter';

const router = Router();

router.get('/review/list', limiter(60), controller.getList);

router.post('/review', limiter(4), controller.create);

export default router;
