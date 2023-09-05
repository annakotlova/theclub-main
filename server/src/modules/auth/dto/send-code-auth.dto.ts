import { User } from '@/modules/user/dto/user.dto';

export type SendCodeAuthDto = Pick<User.Dto, 'phone'> & { referral?: string };

/**
 * @swagger
 * components:
 *  schemas:
 *    SendCodeAuthDto:
 *      description: Тело запроса /api/auth/send/code
 *      type: object
 *      properties:
 *        phone:
 *          type: string
 *        referral:
 *          type: string
 *          required: false
 */