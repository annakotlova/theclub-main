import { Router } from 'express';

import controller from './user.controller';
import authConstants from '../auth/auth.constants';

import { Common } from '@/interfaces/common.dto';

import limiter from '@/middlewares/limiter';
import { verifyAnyToken } from '@/utils/token';

const router = Router();
const validateCode = verifyAnyToken(Common.TokenType.CODE, 'code', false, authConstants.VALIDATE_CODE_EXPIRED);

router.get('/user/list', limiter(60), controller.getList);
router.get('/user/excel', limiter(10), controller.getExcel);

router.post('/user', limiter(4), controller.create);

router.patch('/user', limiter(4), controller.update);
router.patch('/user/subject', limiter(4), controller.updateSubject);
router.patch('/user/password', limiter(4), controller.updatePassword);
router.patch('/user/phone', limiter(4), controller.updatePhone);
router.patch('/user/email', limiter(4), controller.updateEmail);
router.patch('/user/phone/validate', validateCode, limiter(4), controller.validatePhone);

router.delete('/user/:_id', limiter(4), controller.delete);

export default router;
