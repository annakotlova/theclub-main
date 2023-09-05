import { Event } from './event.dto';
import { CreateEventDto } from './create-event.dto';

export type UpdateEventDto = Pick<Event.Dto, '_id'> & CreateEventDto;

/**
 * @swagger
 * components:
 *  schemas:
 *    UpdateEventDto:
 *      description: Тело запроса /api/event (PATCH)
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          description: ID карты
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
 *        endedAt:
 *          type: string
 *          format: date-time
 *          description: Дата окончания мероприятия
 */