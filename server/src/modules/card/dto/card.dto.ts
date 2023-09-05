import { Common } from '@/interfaces/common.dto';

export namespace Card {
  export interface Dto extends Common.BaseModel {
    user: Common.BaseModel['_id'];
    payment: Common.BaseModel['_id'];
    active: boolean;

    type: Type;

    tinkoff: {
      RequestKey: string | null;
      CardId: string | null;
      ExpDate: string | null;
      Pan: string | null;
    };
  }

  export enum Type {
    MASTERCARD = 'MASTERCARD',
    VISA = 'VISA',
    MIR = 'MIR',
    UNKNOWN = 'UNKNOWN',
  }
}

/**
 * @swagger
 * components:
 *  schemas:
 *    CardEntity:
 *      description: Сущность карты
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          description: ID карты
 *        user:
 *          type: string
 *          description: ID пользователя
 *        payment:
 *          type: string
 *          description: ID платежных данных
 *        active:
 *          type: boolean
 *          description: Активирована ли карта
 *        type:
 *          $ref: '#/components/schemas/CardTypeEnum'
 *        tinkoff:
 *          $ref: '#/components/schemas/CardTinkoffEntity'
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 *    CardTinkoffEntity:
 *      description: Данные карты
 *      type: object
 *      properties:
 *        RequestKey:
 *          type: string
 *          description: Ключ запроса в системе тинькоффа
 *        CardId:
 *          type: string
 *          description: ID карты в системе тинькоффа
 *        ExpDate:
 *          type: string
 *          description: Срок действия карты в форметае ММГГ
 *        Pan:
 *          type: string
 *          description: Последние 4 цифры карты в формате ****1234
 *    CardTypeEnum:
 *      type: string
 *      enum:
 *        - MASTERCARD
 *        - VISA
 *        - MIR
 *        - UNKNOWN
 */
