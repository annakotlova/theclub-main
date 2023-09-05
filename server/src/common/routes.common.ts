import express, { Express } from 'express';

import AuthRouter from '@/modules/auth/auth.routes';
import UserRouter from '@/modules/user/user.routes';
import FileRouter from '@/modules/file/file.routes';
import EventRouter from '@/modules/event/event.routes';
import ReviewRouter from '@/modules/review/review.routes';
import QrcodeRouter from '@/modules/event/qrcode/qrcode.routes';
import ReferralRouter from '@/modules/referral/referral.routes';
import TransactionRouter from '@/modules/transaction/transaction.routes';
import NotificationRouter from '@/modules/notification/notification.routes';

import PaymentRouter from '@/modules/payment/payment.routes';
import CardRouter from '@/modules/card/card.routes';

import AdminRouter from '@/modules/admin/admin.routes';
// import SubscriptionRouter from '@/modules/subscription/subscription.routes';

export default (app: Express) => {
  app.use(
    '/api',
    AuthRouter,
    UserRouter,
    FileRouter,
    EventRouter,
    QrcodeRouter,
    ReviewRouter,
    ReferralRouter,
    TransactionRouter,
    NotificationRouter,

    AdminRouter,

    PaymentRouter,
    CardRouter,
    // SubscriptionRouter,
  );

  const folder = String(process.env.FILE_FOLDER);
  app.use(express.static(folder));
};
