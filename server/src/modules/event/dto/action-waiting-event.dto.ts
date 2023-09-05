import { Event } from './event.dto';

export type ActionWaitingEventDto = Pick<Event.Dto, '_id'>;

/**
 * @swagger
 * components:
 *  schemas:
 *    ActionWaitinEventDto:
 *      description: Тело запроса /api/event/action/waiting
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          description: ID мероприятия
 */