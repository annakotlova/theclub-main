import { Server } from 'socket.io';

import socketGuard from './guard';
import socketActions from './action';
import { SocketDto } from './dto/socket.dto';
import { socketJoinRoom, socketLeaveRoom } from './rooms';

class Socket {
  io: Server;
  actions: typeof socketActions;
  constructor() {
    this.io = new Server({ transports: ['polling', 'websocket'] });
    this.actions = socketActions;
    this.authGuard();
    this.connection();
  }
  authGuard() {
    this.io.use((socket, next) => {
      const { status } = socketGuard(socket);
      status ? next() : next(new Error('Invalid token'));
    });
  }
  connection() {
    this.io.on('connection', (socket) => {
      socket.on(SocketDto.CommonEvent.ROOM_JOIN, socketJoinRoom(socket));
      socket.on(SocketDto.CommonEvent.ROOM_LEAVE, socketLeaveRoom(socket));
      socket.on(SocketDto.CommonEvent.CHECK_CONNECTION, (_data: { user: string }, cb: Function) => {
        cb({ status: true });
      });

      socket.on(SocketDto.CommonEvent.DISCONNECT, async () => {
        socket.data.user = null;
      });
    });
  }
  getSocketObject(_id: string | false) {
    if (!_id) return this.io;
    const sockets = Array.from(this.io.sockets.sockets.values());
    return sockets.find((socket) => String(socket.data.user._id) === String(_id));
  }
}

export default new Socket();