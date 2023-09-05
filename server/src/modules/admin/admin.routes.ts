import { Router } from 'express';

import controller from './admin.controller';

import limiter from '@/middlewares/limiter';

const router = Router();

router.get('/admin/statistic', limiter(60), controller.getStatistic);
router.get('/admin/diagrams', limiter(60), controller.getDiagrams);

export default router;