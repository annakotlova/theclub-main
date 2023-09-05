import { User } from './user.dto';

export type ChangePhoneUserDto = Pick<User.Dto, 'phone'>;

/**
 * @swagger
 * components:
 *  schemas:
 *    ChangePhoneUserDto:
 *      description: Тело запроса /api/user/phone
 *      type: object
 *      properties:
 *        phone:
 *          type: string
 */
