import { Router } from 'express';

import controller from './card.controller';

import limiter from '@/middlewares/limiter';

const router = Router();

router.post('/card', limiter(10), controller.create);
router.post('/card/notification', controller.notification);

router.delete('/card', limiter(10), controller.delete);

export default router;
