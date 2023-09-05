export type UpdatePasswordUserDto = {
  password: string;
  repeatPassword: string;
  oldPassword: string;
};

/**
 * @swagger
 * components:
 *  schemas:
 *    UpdatePasswordUserDto:
 *      description: Тело запроса /api/user/password
 *      type: object
 *      properties:
 *        password:
 *          type: string
 *        repeatPassword:
 *          type: string
 *        oldPassword:
 *          type: string
 */
