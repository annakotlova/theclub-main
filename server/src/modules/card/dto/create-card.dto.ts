import { Card } from './card.dto';

export type CreateCardDto = Pick<Card.Dto, 'user'>;

/**
 * @swagger
 * components:
 *  schemas:
 *    CreateCardDto:
 *      type: object
 *      properties:
 *        user:
 *          type: ID пользователя
 */
