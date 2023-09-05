import { User } from '@/modules/user/dto/user.dto';

export type SignupAuthDto = Pick<User.Dto, 'name' | 'password'>;

/**
 * @swagger
 * components:
 *  schemas:
 *    SignupAuthDto:
 *      description: Тело запроса /api/auth/signup
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *        password:
 *          type: string
 */
