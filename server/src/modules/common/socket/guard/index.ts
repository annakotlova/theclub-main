import { Socket } from 'socket.io';
import { parse } from 'cookie';

import { Common } from '@/interfaces/common.dto';

import { verifyJWT } from '@/utils/token';

export default (socket: Socket) => {
  if (typeof socket.handshake.headers.cookie !== 'string') return { status: false };
  const cookies = parse(socket.handshake.headers.cookie);

  const access_token = verifyJWT(String(cookies.token), Common.TokenType.ACCESS);
  socket.data.user = access_token;

  return { status: !!access_token };
};
