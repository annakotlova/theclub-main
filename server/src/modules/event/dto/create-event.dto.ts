import { Event } from './event.dto';

export type CreateEventDto = Event.Dto;

/**
 * @swagger
 * components:
 *  schemas:
 *    CreateEventDto:
 *      description: Тело запроса /api/event (POST)
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          description: Название мероприятия
 *        content:
 *          type: string
 *          description: Описание мероприятия
 *        place:
 *          type: string
 *          description: Место положение оффлайн мероприятия
 *        link:
 *          type: string
 *          description: Ссылка на онлайн мероприятие
 *        minMembers:
 *          type: number
 *          description: Минимальное кол-во участников мероприятия
 *        maxMembers:
 *          type: number
 *          description: Максимальное кол-во участников мероприятия
 *        category:
 *          $ref: '#/components/schemas/EventCategoryEnum'
 *        subject:
 *          $ref: '#/components/schemas/UserSubjectEnum'
 *        startedAt:
 *          type: string
 *          format: date-time
 *          description: Дата начала мероприятия
 */
