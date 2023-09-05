import { Request, Response } from 'express';

import paymentService from './payment.service';
import userService from '../user/user.service';
import referralService from '../referral/referral.service';
import transactionService from '../transaction/transaction.service';

import paymentConstants from './payment.constants';
import cardConstants from '../card/card.constants';
// import smsConstants from '../common/sms/sms.constants';

// import sms from '../common/sms';
import softpay from '../common/softpay';
import tinkoffCredit from '../common/tinkoff/credit';
import { axiosRequest } from '../common/request';
import { paymentSchedule } from '../common/schedule';

import { User } from '../user/dto/user.dto';
import { Payment } from './dto/payment.dto';
import { Softpay } from '../common/softpay/dto';
import { Common } from '@/interfaces/common.dto';
import { FixPaymentDto } from './dto/fix-payment.dto';
import { Tinkoff } from '../common/tinkoff/dto/tinkoff.dto';
import { InitialTinkoffDto } from './dto/initial-tinkoff.dto';
import { InitialPaymentDto } from './dto/initial-payment.dto';
import { Transaction } from '../transaction/dto/transaction.dto';
import { WithdrawalPaymentDto } from './dto/withdrawal-payment.dto';
import { UpdateBalancePaymentDto } from './dto/update-balance-payment.dto';
import { InitialBalancePaymentDto } from './dto/initial-balance-payment.dto';
import { InitialReservePaymentDto } from './dto/initial-reserve-payment.dto';
import { CreateTransactionDto } from '../transaction/dto/create-transaction.dto';

import { Converter, Access } from '@/decorators';

import { generateCodes } from '@/utils/common/codes';
import { differenceTime } from '@/utils/date/date.filter';
import { createCryptoToken, sortHash } from '@/utils/token';
import response, { ErrorHandler } from '@/utils/response';

class PaymentController {
  @Access()
  @ErrorHandler()
  async get(_: Request, res: Response) {
    const _id = res.locals.user._id;

    const paymentFilters: Common.GetByFilters<Payment.Dto> = {
      filters: { user: _id },
      select: '-balanceHash',
      populate: { path: 'card', select: 'type active tinkoff.Pan tinkoff.ExpDate' },
    };
    const payment = await paymentService.findOneByFilters(paymentFilters);
    if (!payment) return response.notFound(res, paymentConstants.NOT_FOUND);

    response.ok(res, null, payment);
  }

  @Access()
  @Converter('payment_initial')
  @ErrorHandler({ log: true })
  async initial(req: Request, res: Response) {
    const _id = res.locals.user._id;
    const dto = req.body as InitialPaymentDto;

    const paymentFilters: Common.GetByFilters<Payment.Dto> = {
      filters: { user: _id },
      populate: { path: 'user', select: 'phone email name activated' },
    };
    const payment = await paymentService.findOneByFilters(paymentFilters);
    if (!payment) return response.notFound(res, paymentConstants.NOT_FOUND);

    if (dto.type === Payment.TariffType.RESERVE && (payment.user.activated || payment.trial))
      return response.badRequest(res, paymentConstants.RESERVE_ERROR);

    const amount =
      dto.type === Payment.TariffType.RESERVE ? 5_000 : Payment.TariffPrice[dto.tariff];

    const payments = {
      CASH: this.paymentCash,
      CREDIT: this.paymentCredit,
      RESERVE: this.paymentReserve,
    };
    const { status, data, order } = await payments[dto.type](
      dto.tariff,
      payment.user,
      false,
      dto.period,
    );
    if (!status) return response.badRequest(res, paymentConstants.PAYMENT_INITIAL_ERROR);

    const types = {
      CASH: Transaction.Type.PAYMENT,
      CREDIT: Transaction.Type.CREDIT,
      RESERVE: Transaction.Type.RESERVE,
    };
    const type = types[dto.type];

    await this.createPaymentTransaction({
      status: Transaction.Status.CREATED,
      payment: payment._id,
      user: _id,
      amount,
      order,
      type,
    });

    response.ok(res, null, data);
  }

  @Access()
  @Converter('payment_reserve_initial')
  @ErrorHandler()
  async initialReserve(req: Request, res: Response) {
    const _id = res.locals.user._id;
    const dto = req.body as InitialReservePaymentDto;

    const paymentFilters: Common.GetByFilters<Payment.Dto> = {
      filters: { user: _id },
      populate: { path: 'user', select: 'phone email name activated' },
    };
    const payment = await paymentService.findOneByFilters(paymentFilters);
    if (!payment) return response.notFound(res, paymentConstants.NOT_FOUND);
    if (!payment.trial || !['CASH', 'CREDIT'].includes(dto.type))
      return response.badRequest(res, paymentConstants.RESERVE_PAYMENT_ERROR);

    const transactionFilters: Common.GetByFilters<Transaction.Dto> = {
      filters: { type: Transaction.Type.RESERVE, status: Transaction.Status.COMPLETED, payment },
      select: 'order',
      lean: true,
    };
    const transaction = await transactionService.findOneByFilters(transactionFilters);
    // TODO: if (!transaction) return response.badRequest(res, paymentConstants.RESERVE_PAYMENT_ERROR);

    const tariff = (transaction?.order?.split('_').shift() ||
      Payment.Tariff.HALFYEAR) as Payment.Tariff;

    const payments = {
      CASH: this.paymentCash,
      CREDIT: this.paymentCredit,
    };
    const { status, data, order } = await payments[dto.type](tariff, payment.user, true);
    if (!status) return response.badRequest(res, paymentConstants.PAYMENT_INITIAL_ERROR);

    const types = {
      CASH: Transaction.Type.PAYMENT,
      CREDIT: Transaction.Type.CREDIT,
    };
    const type = types[dto.type];

    const amount = Payment.TariffPrice[tariff] - 5_000;
    await this.createPaymentTransaction({
      status: Transaction.Status.CREATED,
      payment: payment._id,
      user: _id,
      amount,
      order,
      type,
    });

    response.ok(res, null, data);
  }

  @Access()
  @Converter('payment_balance_initial')
  @ErrorHandler()
  async initialBalance(req: Request, res: Response) {
    const _id = res.locals.user._id;
    const dto = req.body as InitialBalancePaymentDto;

    const paymentFilters: Common.GetByFilters<Payment.Dto> = {
      filters: { user: _id },
      populate: { path: 'user', select: 'phone email name activated' },
    };
    const payment = await paymentService.findOneByFilters(paymentFilters);
    if (!payment) return response.notFound(res, paymentConstants.NOT_FOUND);

    if (payment.balance < Payment.TariffPrice[dto.tariff])
      return response.badRequest(res, paymentConstants.PAYMENT_BALANCE_ERORR);

    const amount = Payment.TariffPrice[dto.tariff];
    const type = Transaction.Type.PAYMENT_BALANCE;
    const order = `${dto.tariff}_Balance_${generateCodes({ length: 12, count: 1 })}`;

    await this.createPaymentTransaction({
      status: Transaction.Status.CREATED,
      payment: payment._id,
      user: _id,
      amount,
      order,
      type,
    });
    await this.confirmed({ Amount: amount * 100, OrderId: order }, true);

    const updateBalance: UpdateBalancePaymentDto = {
      filters: { _id: payment._id },
      amount,
      inc: -1,
    };
    await paymentService.updateBalance(updateBalance);

    response.ok(res, null, { url: '' });
  }

  async paymentCash(tariff: Payment.Tariff, user: User.Dto, trial = false) {
    const order = `${tariff}_${generateCodes({ length: 24 })}`;

    const referrals = await referralService.getReferralParent(user._id);
    const orderData = { order, phone: user.phone, trial, referrals: referrals.join(',') };
    const links = {
      HALFYEAR: (trial ? process.env.SOFTPAY_HALFYEAR_RESERVE : process.env.SOFTPAY_HALFYEAR) || '',
      YEAR: (trial ? process.env.SOFTPAY_YEAR_RESERVE : process.env.SOFTPAY_YEAR) || '',
    };
    const { status, data } = await softpay.create(links[tariff], orderData);
    return { status, data, order };
  }

  async paymentReserve(tariff: Payment.Tariff, user: User.Dto) {
    const order = `${tariff}_${generateCodes({ length: 24 })}`;

    const referrals = await referralService.getReferralParent(user._id);
    const orderData = { order, phone: user.phone, trial: true, referrals: referrals.join(',') };
    const link = process.env.SOFTPAY_RESERVE || '';
    const { status, data } = await softpay.create(link, orderData);
    return { status, data, order };
  }

  async paymentCredit(
    tariff: Payment.Tariff,
    user: User.Dto,
    trial = false,
    period?: Payment.Credit,
  ) {
    const order = `${tariff}_Credit_${generateCodes({ length: 12, count: 1 })}`;
    const orderData = { order, tariff, user };
    const { status, data } = await tinkoffCredit.createOrder(
      orderData,
      period || Payment.Credit.SIX,
      trial,
    );
    return { status, data: { url: data?.link }, order };
  }

  @ErrorHandler()
  async fix(req: Request, res: Response) {
    const dto = req.body as FixPaymentDto;
    if (!dto.password || dto.password !== process.env.SECRET_PAYMENT)
      return response.conflict(res, null);

    const paymentFilters: Common.GetByFilters<Payment.Dto> = {
      filters: { user: dto.user },
    };
    const payment = await paymentService.findOneByFilters(paymentFilters);
    if (!payment) return response.notFound(res, paymentConstants.NOT_FOUND);

    response.ok(res, null);

    await paymentService.updateBalance({
      filters: { _id: payment._id },
      amount: dto.amount,
      inc: 1,
    });
  }

  @Access()
  @ErrorHandler()
  async cancelSubTemp(_: Request, res: Response) {
    const user = res.locals.user._id;
    const paymentUpdate: Common.UpdateByFilters<Payment.Dto> = {
      filters: { user },
      update: { cancel: true },
      updated: true,
      select: 'cancel',
    };
    const payment = await paymentService.update(paymentUpdate);
    if (!payment) return response.notFound(res, paymentConstants.NOT_FOUND);

    response.ok(res, null, payment);
  }

  @Access()
  @Converter('payment_withdrawal')
  @ErrorHandler()
  async withdrawal(req: Request, res: Response) {
    const user = res.locals.user._id;
    const dto = req.body as WithdrawalPaymentDto;

    const paymentFilters: Common.GetByFilters<Payment.Dto> = {
      filters: { user },
      populate: { path: 'card', select: 'tinkoff active' },
      lean: true,
    };
    const payment = await paymentService.findOneByFilters(paymentFilters);

    if (!payment) return response.notFound(res, paymentConstants.NOT_FOUND);
    if (!payment.card) return response.notFound(res, cardConstants.NOT_FOUND);
    if (!payment.card.active) return response.notFound(res, cardConstants.NOT_ACTIVE);

    if (payment.balance < dto.amount)
      return response.badRequest(res, paymentConstants.INSUFFICIENT_BALANCE);

    const validateHash = paymentService.validateBalanceHash(payment);
    if (!validateHash) return response.badRequest(res, paymentConstants.WITHDRAWAL_BALANCE_ERROR);

    if (dto.amount < 1_000 || dto.amount > 200_000)
      return response.badRequest(res, paymentConstants.MIN_MAX_WITHDRAWAL_AMOUNT);

    const order = `TheClub_Withdrawal_${generateCodes({ length: 16 })}`;
    const withdrawal = await this.withdrawalTinkoff(payment, order, dto.amount);
    if (!withdrawal) return response.badRequest(res, paymentConstants.WITHDRAWAL_ERROR);
    if (!withdrawal.status) return response.badRequest(res, withdrawal.message);

    const paymentBalance = await paymentService.updateBalance({
      filters: { _id: payment._id },
      amount: dto.amount,
      inc: -1,
    });
    if (!paymentBalance) return response.badRequest(res, paymentConstants.WITHDRAWAL_ERROR);
    response.ok(res, null, paymentBalance);

    const pan = String(payment.card.tinkoff.Pan);
    await this.createPaymentTransaction({
      user,
      pan,
      payment: payment._id,
      order,
      type: Transaction.Type.CONCLUSION,
      status: Transaction.Status.COMPLETED,
      amount: dto.amount,
    });
  }

  @ErrorHandler({ request: false })
  async withdrawalTinkoff(payment: Payment.Dto, _: string, amount: number) {
    if (!payment?.card?.tinkoff?.CardId)
      return { status: false, message: cardConstants.NOT_LINKED };

    const withdrawal = await softpay.withdrawal(String(payment.user), amount);
    if (!withdrawal.status) return { status: false, message: withdrawal.message };

    return { status: true, message: '' };
  }

  @ErrorHandler()
  async notificationCredit(req: Request, res: Response) {
    const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress);

    const dto = req.body as Tinkoff.PaymentNotificationCredit;
    if (!ip.includes('91.194.226') && !ip.includes('91.194.227')) response.ok(res);

    if (['inprogress', 'issued', 'new', 'approved'].includes(dto.status)) return response.ok(res);
    if (['rejected', 'canceled'].includes(dto.status)) {
      this.rejected(dto.id);
      return response.ok(res);
    }
    if (dto.demo) return response.ok(res);

    if (dto.status === 'signed')
      await this.confirmed({ OrderId: dto.id, Amount: dto.order_amount * 100 });
    response.ok(res);
  }

  @ErrorHandler()
  async softpay(req: Request, res: Response) {
    const dto = req.body as Softpay.Response;
    console.log(dto);

    const token = dto.token;
    const data = dto.data;
    if (!token || !data) return response.badRequest(res);

    delete dto.data;
    delete dto.token;
    delete dto.questions;

    dto.secret = process.env.SOFTPAY_WEBHOOK;

    const hash = sortHash(dto);
    const secret = createCryptoToken(hash, 'sha256');
    if (secret !== token) return response.badRequest(res);

    if (dto.status === Softpay.StatusResponse.CONFIRMED)
      await this.confirmed({ Amount: dto.amount * 100, OrderId: data.order, trial: data.trial });

    response.ok(res);
  }

  async confirmed(dto: Tinkoff.PaymentConfirmed, confirmed = true) {
    const amount = +dto.Amount / 100;
    const transactionUpdate: Common.UpdateByFilters<Transaction.Dto> = {
      filters: { order: dto.OrderId, status: Transaction.Status.CREATED },
      update: { status: Transaction.Status.COMPLETED, amount, updatedAt: new Date() },
      populate: { path: 'user', select: 'phone' },
    };
    const transaction = await transactionService.update(transactionUpdate);
    if (!transaction || !confirmed) return false;

    await this.activate(transaction.user._id, amount);
    await this.updateSubscription(transaction.payment, dto.OrderId, dto.trial || false);

    return true;
  }

  async rejected(order: string) {
    const transactionUpdate: Common.UpdateByFilters<Transaction.Dto> = {
      filters: { order },
      update: { status: Transaction.Status.REJECTED, updatedAt: new Date() },
    };
    await transactionService.update(transactionUpdate);
  }

  async updateSubscription(_id: Common.BaseModel['_id'], order: string, trial: boolean) {
    const paymentFilters: Common.GetByFilters<Payment.Dto> = {
      filters: { _id },
      select: 'subscriptionAt',
    };
    const payment = await paymentService.findOneByFilters(paymentFilters);
    if (!payment) return false;

    let cSubscription = new Date(payment.subscriptionAt || Date.now());
    if (trial) {
      cSubscription = new Date(cSubscription.setDate(cSubscription.getDate() + 15));
    } else {
      const days = order.includes('HALF') ? Payment.TariffDays.HALFYEAR : Payment.TariffDays.YEAR;
      if (Number(cSubscription) < Date.now()) cSubscription = new Date();
      cSubscription = new Date(cSubscription.setDate(cSubscription.getDate() + days));
    }

    const paymentUpdate: Common.UpdateByFilters<Payment.Dto> = {
      filters: { _id },
      update: { subscriptionAt: cSubscription, trial },
      updated: true,
    };
    const updated = await paymentService.update(paymentUpdate);
    if (updated) paymentSchedule(updated);

    return true;
  }

  @ErrorHandler({ request: false })
  async activate(_id: Common.BaseModel['_id'], amount: number) {
    await Promise.all([
      userService.updateActivated({ user: _id, activated: true }),
      referralService.updateActive({ member: _id, active: true }),
      referralService.updatePayments(_id, amount),
    ]);
  }

  @ErrorHandler({ request: false })
  async notificationCancel() {
    const started = new Date();
    const ended = new Date().setDate(started.getDate() + 14);
    const paymentFilters: Common.GetByFilters<Payment.Dto> = {
      filters: { subscriptionAt: { $gte: started, $lte: ended } },
      select: 'user subscriptionAt',
      populate: { path: 'user', select: 'name phone' },
    };
    const payments = await paymentService.findByFilters(paymentFilters);
    const differenceDates = {
      0: 'сегодня',
      3: 'через 3 дня',
      14: 'через 2 недели',
    };

    for (const payment of payments) {
      if (payment.user) {
        const difference = Math.floor(
          differenceTime(payment.subscriptionAt, started),
        ) as keyof typeof differenceDates;
        const date = differenceDates[difference];
        if (!date) continue;

        console.log(payment.user.name, date);
        // await sms.sendWhatsApp({
        //   phone: payment.user.phone,
        //   text: smsConstants.SUBSCRIPTION_SCHEDULE(payment.user.name, date),
        // });
      }
    }
  }

  @ErrorHandler({ request: false })
  async cancel(_id: Common.BaseModel['_id']) {
    const paymentFilters: Common.GetByFilters<Payment.Dto> = {
      filters: { _id },
      select: 'user subscriptionAt',
      populate: { path: 'user', select: 'name phone' },
    };
    const payment = await paymentService.findOneByFilters(paymentFilters);
    if (!payment) return false; // Платежные данные не найдены

    if (Number(new Date(payment.subscriptionAt)) > Date.now()) return false; // Подписка продлена

    // if (payment.user)
    // await sms.sendWhatsApp({
    //   phone: payment.user.phone,
    //   text: smsConstants.SUBSCRIPTION_CANCEL(payment.user.name),
    // });

    await userService.updateActivated({ user: payment.user._id, activated: false });
    await referralService.updateActive({ member: payment.user._id, active: false });
  }

  async tinkoff(amount: number, order: string) {
    const main = String(process.env.MAIN_URL);

    const data = {
      Amount: amount * 100,
      OrderId: order,
      Description: `Оплата подписки The Club`,
      TerminalKey: String(process.env.TINKOFF_TERMINAL_DEFAULT),
      FailURL: main + '/payment/rejected',
      SuccessURL: main + '/payment/confirmed',
    } as InitialTinkoffDto;

    const response = await axiosRequest({
      url: String(process.env.TINKOFF_API) + '/Init/',
      method: 'post',
      data,
    });
    if (!response.status || !response.data.Success) return response;
    return { status: true, data: { url: String(response.data.PaymentURL) } };
  }

  async createPaymentTransaction(dto: CreateTransactionDto) {
    const transactionCreate: CreateTransactionDto = {
      status: Transaction.Status.CREATED,
      payment: dto.payment,
      user: dto.user,
      amount: dto.amount,
      order: dto.order,
      type: dto.type,
    };
    return await transactionService.create(transactionCreate);
  }
}

export default new PaymentController();
