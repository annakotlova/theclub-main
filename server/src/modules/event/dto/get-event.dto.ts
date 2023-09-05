import { Common } from '@/interfaces/common.dto';
import { Event } from './event.dto';
import { User } from '@/modules/user/dto/user.dto';

export interface GetEventDto extends Common.GetList {
  category?: Event.Category;
  organizer?: Event.Organizer;
  subject?: User.Subject;
  sort?: Event.Sort;
}

/**
 * @swagger
 * components:
 *  schemas:
 *    GetEventDto:
 *      description: Query запроса /api/event/дшые
 *      type: object
 *      properties:
 *        category:
 *          $ref: '#/components/schemas/EventCategoryEnum'
 *        organizer:
 *          $ref: '#/components/schemas/EventOrganizerEnum'
 *        subject:
 *          $ref: '#/components/schemas/UserSubjectEnum'
 *        sort:
 *          $ref: '#/components/schemas/EventSortEnum'
 */