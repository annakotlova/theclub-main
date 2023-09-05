import { User } from './user.dto';

export type UpdateSubjectUserDto = { subjects: Array<User.Subject> };

/**
 * @swagger
 * components:
 *  schemas:
 *    UpdateSubjectUserDto:
 *      description: Тело запроса /api/user/subject
 *      type: object
 *      properties:
 *        subjects:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/UserSubjectEnum'
 */