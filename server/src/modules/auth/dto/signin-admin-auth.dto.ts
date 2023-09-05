import { User } from '@/modules/user/dto/user.dto';

export type SigninAdminAuthDto = Pick<User.Dto, 'email' | 'password'>;

/**
 * @swagger
 * components:
 *  schemas:
 *    SigninAdminAuthDto:
 *      description: Тело запроса /api/auth/signin/admin
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *          example: ofswg@mail.ru
 *        password:
 *          type: string
 */