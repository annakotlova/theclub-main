import { Router } from 'express';

import controller from './qrcode.controller';

import limiter from '@/middlewares/limiter';

const router = Router();

router.get('/qrcode/:code', limiter(120), controller.validate);

router.patch('/qrcode/approve', limiter(120), controller.approve);

export default router;