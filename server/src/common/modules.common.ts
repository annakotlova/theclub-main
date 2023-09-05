import express, { Express } from 'express';
import dotenv from 'dotenv';
import cookie from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import limiter from 'express-rate-limit';

// import csrf from './csrf.common';
import { getDotEnvOptions } from '@config/dotenv.config';
import { getCorsOptions } from '@config/cors.config';
import { getHelmetOptions } from '@config/helmet.config';
import { getLimiterOptions } from '@config/limiter.config';

import tinkoffCredit from '@/modules/common/tinkoff/credit';
import schedule from '@/modules/common/schedule';
import softpay from '@/modules/common/softpay';
import sms from '@/modules/common/sms';

export default (app: Express) => {
  dotenv.config(getDotEnvOptions());
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '50MB' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookie(), compression(), morgan('dev'));
  app.use('/api', limiter(getLimiterOptions()));

  if (isProd) app.use(cors(getCorsOptions()), helmet(getHelmetOptions()));

  // csrf(app);

  if (process.env.pm_id === '0' || !isProd) schedule();
  sms.init();
  softpay.init();
  tinkoffCredit.init();
};
