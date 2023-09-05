import { Router } from 'express';

import controller from './file.controller';
import { multerCommonCover, multerExcel, multerUserAvatar } from './file.multer';

import limiter from '@/middlewares/limiter';
import { AccessMiddleware } from '@/decorators';

const router = Router();
router.post("/file/user", multerExcel.single('excel'), controller.uploadUser);

router.patch("/file/user/avatar", AccessMiddleware, multerUserAvatar('USER_FOLDER').single('avatar'), limiter(10), controller.updateUserAvatar);
router.patch("/file/event/cover", AccessMiddleware, multerCommonCover('EVENT_FOLDER').single('cover'), limiter(10), controller.updateEventCover);

router.delete('/file/user/avatar/:_id', limiter(10), controller.deleteUserAvatar);

export default router;