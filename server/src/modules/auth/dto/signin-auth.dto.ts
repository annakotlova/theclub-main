import { User } from '@/modules/user/dto/user.dto';

export type SigninAuthDto = Pick<User.Dto, 'phone' | 'password'>;

/**
 * @swagger
 * components:
 *  schemas:
 *    SigninAuthDto:
 *      description: Тело запроса /api/auth/signin
 *      type: object
 *      properties:
 *        phone:
 *          type: string
 *          example: +7(999)330-90-25
 *        password:
 *          type: string
 */