import { Router } from 'express';

import controller from './auth.controller';

import { Common } from '@/interfaces/common.dto';

import limiter from '@/middlewares/limiter';
import authConstants from './auth.constants';
import { verifyAnyToken } from '@/utils/token';

const router = Router();
const validateCode = verifyAnyToken(Common.TokenType.CODE, 'code', false, authConstants.VALIDATE_CODE_EXPIRED);
const validateReset = verifyAnyToken(Common.TokenType.RESET, 'reset', false, authConstants.VALIDATE_CODE_EXPIRED);

router.get('/auth/authentication', limiter(60), controller.authentication);
// router.get('/auth/csrf', limiter(60), controller.getCSRF);

router.post('/auth/signin', limiter(10), controller.signin);
router.post('/auth/signin/admin', limiter(10), controller.signinAdmin);

router.post('/auth/send/code', limiter(6), controller.sendCode);
router.post('/auth/resend/code', validateCode, limiter(2), controller.resendCode);
router.post('/auth/validate/code', validateCode, limiter(8), controller.validateCode);
router.post('/auth/signup', validateCode, limiter(10), controller.singup);

router.post('/auth/recovery', limiter(6), controller.recovery);
router.post('/auth/recovery/code', validateReset, validateCode, limiter(10), controller.recoveryCode);
router.post('/auth/recovery/password', validateReset, limiter(10), controller.recoveryPassword);

router.post('/auth/logout', limiter(10), controller.logout);

export default router;
