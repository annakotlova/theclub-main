import { Event } from './event.dto';

export type ActionEventDto = Pick<Event.Dto, '_id'>;

/**
 * @swagger
 * components:
 *  schemas:
 *    ActionEventDto:
 *      description: Тело запроса /api/event/action
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          description: ID мероприятия
 */