import { Common } from '@/interfaces/common.dto';
import { File } from '@/modules/file/dto/file.dto';
import { User } from '@/modules/user/dto/user.dto';

export namespace Event {
  export interface Dto extends Common.BaseModel {
    name: string;
    content: string;
    additional: string;
    place: string;
    link: string;

    cover: File.Dto;
    creator: User.Dto;

    format: Format;
    category: Category;
    organizer: Organizer;
    subject: User.Subject;
    status: Status;

    minMembers: number;
    maxMembers: number;
    members: Array<User.Dto>;
    membersLength: number;
    waiting: Array<User.Dto>;
    supports: Array<{ approved: boolean; member: User.Dto }>;

    startedAt: Date;
    endedAt: Date;

    // Lean
    isMember: boolean;
    isWaiting: boolean;
    qrcode: string;
    period: string;
  }

  export enum Category {
    ONLINE = 'ONLINE',
    OFFLINE = 'OFFLINE',
  }

  export enum Status {
    CREATED = 'CREATED',
    IN_PROGRESS = 'IN_PROGRESS',
    FINISHED = 'FINISHED',
    CANCELED = 'CANCELED',
    BLOCKED = 'BLOCKED',
  }

  export enum Format {
    MASTERMIND = 'MASTERMIND',
    WEBINAR = 'WEBINAR',
    TRAINING = 'TRAINING',
    WORKSHOP = 'WORKSHOP',
    COMMUNICATION = 'COMMUNICATION',
    OTHER = 'OTHER',
  }

  export enum Organizer {
    CLUB = 'CLUB',
    MEMBERS = 'MEMBERS',
  }

  export enum Sort {
    POPULAR = 'POPULAR',
    NOVELTY = 'NOVELTY',
    NEAREST = 'NEAREST',
  }

  export enum Action {
    join = 'join',
    leave = 'leave',
  }
}

/**
 * @swagger
 * components:
 *  schemas:
 *    EventEntity:
 *      description: Сущность мероприятия
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
 *        members:
 *          type: array
 *          items:
 *            type: string
 *            description: ID пользователя
 *        cover:
 *          $ref: '#/components/schemas/FilePopulateEntity'
 *        creator:
 *          $ref: '#/components/schemas/EventCreatorEntity'
 *        category:
 *          $ref: '#/components/schemas/EventCategoryEnum'
 *        organizer:
 *          $ref: '#/components/schemas/EventOrganizerEnum'
 *        subject:
 *          $ref: '#/components/schemas/UserSubjectEnum'
 *        isMember:
 *          type: boolean
 *          description: Является ли авторизованный пользователь участником мероприятия
 *        startedAt:
 *          type: string
 *          format: date-time
 *          description: Дата начала мероприятия
 *        endedAt:
 *          type: string
 *          format: date-time
 *          description: Дата окончания мероприятия
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *    EventCategoryEnum:
 *      type: string
 *      enum:
 *        - ONLINE
 *        - OFFLINE
 *    EventOrganizerEnum:
 *      type: string
 *      enum:
 *        - CLUB
 *        - MEMBERS
 *    EventSortEnum:
 *      type: string
 *      enum:
 *        - POPULAR
 *        - NOVELTY
 */
