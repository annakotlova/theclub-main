import schedule from 'node-schedule';

import eventService from '@/modules/event/event.service';
import paymentService from '@/modules/payment/payment.service';

import eventController from '@/modules/event/event.controller';
import paymentController from '@/modules/payment/payment.controller';
import qrcodeController from '@/modules/event/qrcode/qrcode.controller';
// import userController from '@/modules/user/user.controller';

import { Common } from '@/interfaces/common.dto';
import { Event } from '@/modules/event/dto/event.dto';
import { Payment } from '@/modules/payment/dto/payment.dto';

export default async () => {
  paymentListSchedule();
  eventListSchedule();
  // userListSchedule();
};

// const userListSchedule = async () => {
//   schedule.scheduleJob('users_unactive', '0 0 * * *', userController.deleteUnactive);
// };

const paymentListSchedule = async () => {
  const payments = await getPaymentList();
  for (const payment of payments) paymentSchedule(payment);
  schedule.scheduleJob('payments_notification', '0 4 * * *', paymentController.notificationCancel);
};

const eventListSchedule = async () => {
  const events = await getEventList();
  for (const event of events) eventSchedule(event);
  // for (const key in schedule.scheduledJobs) console.log(key);
};

export const paymentSchedule = ({ _id, subscriptionAt }: Payment.Dto) => {
  const id = `payment-${_id}`;
  schedule.cancelJob(id);
  schedule.scheduleJob(id, subscriptionAt, () => paymentController.cancel(_id));
};

export const eventSchedule = ({ _id, startedAt, endedAt, category }: Event.Dto) => {
  const id = `event-${_id}`;
  const started = +new Date(startedAt);
  const ended = +new Date(endedAt);

  const expiredAt = started + 2_400_000;
  const generateAt = started - 2_400_000;

  // TODO: check minMembers
  eventCancelSchedule(_id);
  // console.log('-------------');
  // console.log(`${new Date(started)} - ${new Date(ended)}`);
  schedule.scheduleJob(id + '_progress', started, () =>
    eventController.updateStatus(_id, Event.Status.IN_PROGRESS),
  );
  schedule.scheduleJob(id + '_finished', ended, () =>
    eventController.updateStatus(_id, Event.Status.FINISHED),
  );
  if (category === Event.Category.OFFLINE) {
    // console.log(`${new Date(generateAt)} - ${new Date(expiredAt)}`);
    schedule.scheduleJob(id + '_qrcode', generateAt, () => eventController.generateCodes(_id));
    schedule.scheduleJob(id + '_qrcode_expired', expiredAt, () => qrcodeController.expired(_id));
  }
};

export const eventCancelSchedule = (_id: Common.BaseModel['_id']) => {
  const id = `event-${_id}`;
  schedule.cancelJob(id + '_progress');
  schedule.cancelJob(id + '_finished');
  schedule.cancelJob(id + '_qrcode');
  schedule.cancelJob(id + '_qrcode_expired');
};

const getPaymentList = async () => {
  const paymentFilters: Common.GetByFilters<Payment.Dto> = {
    filters: { subscriptionAt: { $gte: new Date() } },
    select: 'subscriptionAt',
  };
  return await paymentService.findByFilters(paymentFilters);
};

const getEventList = async () => {
  const eventFilters: Common.GetByFilters<Event.Dto> = {
    filters: { startedAt: { $gte: new Date() } },
    select: 'startedAt endedAt category',
  };
  return await eventService.findByFilters(eventFilters);
};
