import { Express, Request, Response, NextFunction } from 'express';
import csurf from 'csurf';

import { getCSRFOptions } from '@config/csrf.config';
import response from '@/utils/response';

const exceptions = [
  '/api/payment/notification/credit',
  '/api/payment/notification',
  '/api/payment/softpay',
  '/api/payment/fix',
  '/api/user',

  '/api/card/notification',
  '/api/file/user',
];

export default (app: Express) => {
  app.use(csurf(getCSRFOptions()));
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.code !== 'EBADCSRFTOKEN' || req.method === 'GET' || exceptions.includes(req.path))
      return next();
    response.forbidden(res, 'Ошибка сессии! Попробуйте обновить страницу!');
  });
};
