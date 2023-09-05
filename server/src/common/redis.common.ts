import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { Socket } from 'socket.io';

import socket from '@/modules/common/socket';
import { getRedisURI } from '@config/redis.config';

export default () => {
  const pubClient = createClient({ url: getRedisURI() });
  const subClient = pubClient.duplicate();

  Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    socket.io.adapter(createAdapter(pubClient, subClient));
    socket.io.on('connection', (socket: Socket) => {
      console.log(`${socket.id} подключен`);
    });
  });
};
