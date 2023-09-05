import { Common } from '@/interfaces/common.dto';
import { Card } from '@/modules/card/dto/card.dto';
import { User } from '@/modules/user/dto/user.dto';

export namespace Payment {
  export interface Dto extends Common.BaseModel {
    user: User.Dto;
    card: Card.Dto;

    trial: boolean;
    cancel: boolean;

    balance: number;
    balanceHash: string;

    subscriptionAt: Date;
  }
  export enum Tariff {
    HALFYEAR = 'HALFYEAR',
    YEAR = 'YEAR',
  }
  export enum TariffType {
    CASH = 'CASH',
    CREDIT = 'CREDIT',
    RESERVE = 'RESERVE',
  }
  export enum Credit {
    SIX = 'SIX',
    THREE = 'THREE'
  }
  export enum TariffDays {
    HALFYEAR = 180,
    YEAR = 365,
  }
  export enum TariffPrice {
    HALFYEAR = 35_000,
    YEAR = 65_000,
  }
  export enum TariffName {
    HALFYEAR = '6 Месяцев',
    YEAR = '12 Месяцев',
  }
}

/**
 * @swagger
 * components:
 *  schemas:
 *    PaymentEntity:
 *      description: Сущность платежных данных
 *      type: object
 *      properties:
 *        _id:
 *          type: string
 *          description: ID карты
 *        user:
 *          $ref: '#/components/schemas/UserEntity'
 *        card:
 *          $ref: '#/components/schemas/CardEntity'
 *        cancel:
 *          type: boolean
 *          description: Отменена ли подписка (временно)
 *        balance:
 *          type: number
 *          description: Ссылка на онлайн мероприятие
 *        subscriptionAt:
 *          type: string
 *          format: date-time
 *          description: Дата окончания подписки
 *        createdAt:
 *          type: string
 *          format: date-time
 *        updatedAt:
 *          type: string
 *          format: date-time
 */
