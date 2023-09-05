import { Common } from '@/interfaces/common.dto';
import { File } from '@/modules/file/dto/file.dto';

export namespace User {
  export interface Dto extends Common.BaseModel {
    number: number;
    name: string;
    login: string;
    email: string;
    about: string;
    phone: string;
    password: string;
    role: Role;
    subjects: Array<Subject>;
    birthday: Date;

    activated: boolean;
    verified: boolean;

    avatar: File.Dto;

    // Leaned
    subscription?: Date;
  }
  export enum Role {
    ADMIN = 'ADMIN',
    PATRION = 'PATRION',
    USER = 'USER',
  }
  export enum RoleName {
    ADMIN = 'Администратор',
    PATRION = 'Патрион',
    USER = 'Пользователь',
  }
  export enum Subject {
    SPIRIT = 'SPIRIT',
    BODY = 'BODY',
    MIND = 'MIND',
    OTHER = 'OTHER',
  }
}

/**
 * @swagger
 * components:
 *  schemas:
 *    UserEntity:
 *      description: Сущность пользователя
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          description: ID пользователя
 *        name:
 *          type: string
 *          description: ФИО пользователя
 *        login:
 *          type: string
 *          description: Логин пользователя
 *        email:
 *          type: string
 *          description: Почта пользователя
 *        about:
 *          type: string
 *          description: Описание профиля
 *        phone:
 *          type: string
 *          description: Номер телефона пользователя
 *        password:
 *          type: string
 *          description: Пароль пользователя (соль)
 *        avatar:
 *          $ref: '#/components/schemas/FilePopulateEntity'
 *        activated:
 *          type: boolean
 *          description: Активен ли пользователь (оплатил ли подписку)
 *        verified:
 *          type: boolean
 *          description: Верифицирован ли пользователь
 *        role:
 *          $ref: '#/components/schemas/UserRoleEnum'
 *        subjects:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/UserSubjectEnum'
 *        birthday:
 *          type: string
 *          format: date-time
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *    EventCreatorEntity:
 *      description: Сущность пользователя
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          description: ID пользователя
 *        name:
 *          type: string
 *          description: ФИО пользователя
 *        login:
 *          type: string
 *          description: Логин пользователя
 *        avatar:
 *          $ref: '#/components/schemas/FilePopulateEntity'
 *        verified:
 *          type: boolean
 *          description: Верифицирован ли пользователь
 *    UserRoleEnum:
 *      type: string
 *      enum:
 *        - ADMIN
 *        - USER
 *    UserSubjectEnum:
 *      type: string
 *      enum:
 *        - SRIPIT
 *        - BODY
 *        - MIND
 */
