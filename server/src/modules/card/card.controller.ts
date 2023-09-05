import { Request, Response } from 'express';

import cardService from './card.service';
import paymentService from '../payment/payment.service';

import cardConstants from './card.constants';
import paymentConstants from '../payment/payment.constants';

import softpay from '../common/softpay';
import socket from '../common/socket';

import { Card } from './dto/card.dto';
import { Common } from '@/interfaces/common.dto';
import { Payment } from '../payment/dto/payment.dto';
import { Tinkoff } from '../common/tinkoff/dto/tinkoff.dto';
import { SocketDto } from '../common/socket/dto/socket.dto';

import { Access } from '@/decorators';

import response, { ErrorHandler, STATUS_CODE } from '@/utils/response';

class CardController {
  @Access()
  @ErrorHandler()
  async create(_: Request, res: Response) {
    const user = res.locals.user._id;
    const exist = await cardService.findOneByFilters({
      filters: { user },
    });
    if (exist && exist.active) return response.created(res, null, exist);

    const card = exist || (await cardService.create({ user }));
    const customerKey = String(card.user);

    const tCard = await softpay.bindCard(customerKey);
    if (!tCard.status) return response.badRequest(res);
    
    const paymentUpdate: Common.UpdateByFilters<Payment.Dto> = {
      filters: { user },
      update: { card: card._id },
    };
    const payment = await paymentService.update(paymentUpdate);
    if (!payment) return response.notFound(res, paymentConstants.NOT_FOUND);

    const cardUpdate: Common.UpdateByFilters<Card.Dto> = {
      filters: { _id: card._id },
      update: {
        tinkoff: { RequestKey: tCard.data?.key || null },
        payment: payment._id, 
      },
    };
    await cardService.update(cardUpdate);
    response.created(res, null, { url: tCard.data?.url });
  }

  @ErrorHandler()
  async notification(req: Request, res: Response) {
    const dto = req.body as Tinkoff.CardNotification;
    if (dto.Status !== Tinkoff.StatusResponse.COMPLETED) return res.sendStatus(STATUS_CODE.OK);

    const cardFilters: Common.GetByFilters<Card.Dto> = {
      filters: {
        user: dto.CustomerKey,
        'tinkoff.RequestKey': dto.RequestKey,
      },
    };
    const card = await cardService.findOneByFilters(cardFilters);
    if (!card) return response.notFound(res);

    const cardUpdate: Common.UpdateByFilters<Card.Dto> = {
      filters: { _id: card._id },
      update: {
        'tinkoff.ExpDate': dto.ExpDate,
        'tinkoff.CardId': dto.CardId,
        'tinkoff.Pan': dto.Pan.substring(8),
        active: true,
        type: this.detectCardType(dto.Pan),
      },
      updated: true,
    };
    const updated = await cardService.update(cardUpdate);
    if (updated) socket.actions.card(dto.CustomerKey, updated, SocketDto.CardAction.create);

    res.status(STATUS_CODE.OK).send('OK');
  }

  @Access()
  @ErrorHandler()
  async delete(_: Request, res: Response) {
    const user = res.locals.user._id;

    const cardFilters: Common.GetByFilters<Card.Dto> = {
      filters: { user },
    };
    const card = await cardService.findOneByFilters(cardFilters);
    if (!card) return response.notFound(res, cardConstants.NOT_FOUND);

    await cardService.delete({ filters: { _id: card._id } });
    response.ok(res, null);

    const paymentUpdate: Common.UpdateByFilters<Payment.Dto> = {
      filters: { user },
      update: { card: null },
    };
    await paymentService.update(paymentUpdate);
  }

  detectCardType(pan: string) {
    const types = [
      { type: Card.Type.MIR, regex: /^2/g },
      { type: Card.Type.VISA, regex: /^4/g },
      { type: Card.Type.MASTERCARD, regex: /^5[1-5]/g },
    ];
    return types.find((t) => pan.match(t.regex))?.type || Card.Type.UNKNOWN;
  }
}

export default new CardController();
