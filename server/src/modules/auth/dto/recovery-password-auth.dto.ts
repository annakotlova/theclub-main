export type RecoveryPasswordAuthDto = { password: string; repeatPassword: string };

/**
 * @swagger
 * components:
 *  schemas:
 *    RecoveryPasswordAuthDto:
 *      description: Тело запроса /api/auth/recovery/password
 *      type: object
 *      properties:
 *        password:
 *          type: string
 *        repeatPassword:
 *          type: string
 */
