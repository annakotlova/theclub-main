import { User } from '@/modules/user/dto/user.dto';

export type RecoveryAuthDto = Pick<User.Dto, 'phone'>;

/**
 * @swagger
 * components:
 *  schemas:
 *    RecoveryAuthDto:
 *      description: Тело запроса /api/auth/recovery
 *      type: object
 *      properties:
 *        phone:
 *          type: string
 */