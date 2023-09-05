import { User } from './user.dto';

export type UpdateUserDto = Pick<User.Dto, 'about' | 'name' | 'birthday'>;

/**
 * @swagger
 * components:
 *  schemas:
 *    UpdateUserDto:
 *      description: Тело запроса /api/user (PATCH)
 *      type: object
 *      properties:
 *        about:
 *          type: string
 *        name:
 *          type: string
 *        birthday:
 *          type: string
 *          format: date-timeg
 */