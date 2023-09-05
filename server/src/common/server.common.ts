import { Express } from 'express';

import { getCorsOptions } from '@config/cors.config';

import socket from '@/modules/common/socket';
import redisCommon from './redis.common';

export default async (app: Express) => {
  const isProd = process.env.NODE_ENV === 'production';

  const host = process.env.HOST || 'localhost';
  const port = +(process.env.PORT || 3000);
  const server = app.listen(port, host, () => {
    console.log(`Server started: ${host}:${port}`);
  });

  socket.io.attach(server, {
    cors: getCorsOptions(),
  });

  if (isProd) redisCommon();
};
