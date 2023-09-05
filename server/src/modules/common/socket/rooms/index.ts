import { SocketDto } from '../dto/socket.dto';

export const socketJoinRoom: SocketDto.RoomFunction = (socket) => (data, cb) => {
  if (!data.room) return cb({ status: false });

  socket.join(data.room);
  console.log('join room: ' + data.room);

  return cb({ status: true });
};

export const socketLeaveRoom: SocketDto.RoomFunction = (socket) => (data, cb) => {
  if (!data.room) return cb({ status: false });

  socket.leave(data.room);
  console.log('leave room: ' + data.room);

  return cb({ status: true });
};
