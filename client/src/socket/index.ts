import { io, Socket } from 'socket.io-client';
import { SocketResponse } from '@/interfaces/common/index.dto';
import { SocketEvent } from '@/utils/enums/socket';
import { useGlobalStore } from '@/store/global';

const globalStore = useGlobalStore();

class SocketCommon {
  socket: Socket;
  timeoutCheck: number;
  constructor() {
    this.timeoutCheck = 0;
    const host = String(import.meta.env.VITE_SOCKET_URL);
    this.socket = io(host, { transports: ['websocket', 'polling'] });
  }
  connect() {
    this.socket.on('connect', () => {
      if (import.meta.env.DEV)
        console.log('%c SOCKET: connect ', 'background: #4856D6; color: #fff');
      if (globalStore.rooms.length) this.join(globalStore.rooms, false);
    });
    this.socket.on('disconnect', () => {
      if (import.meta.env.DEV)
        console.log('%c SOCKET: disconnect ', 'background: #4856D6; color: #fff');
      this.socket.connect();
    });
  }
  join(room: string | string[], joining = true) {
    if (joining) globalStore.updateRooms(room as string);
    this.socket.emit(SocketEvent.JOIN_ROOM, { room }, (data: SocketResponse) => {
      console.log(data);
    });
  }
  leave(room: string) {
    globalStore.destroyRoom(room);
    this.socket.emit(SocketEvent.LEAVE_ROOM, { room }, (data: SocketResponse) => {
      console.log(data);
    });
  }
  emit(event: string, data: Record<string, any>, cb?: (...args: any[]) => void) {
    this.socket.emit(event, data, cb);
  }
  on(emit: string, cb: (...args: any[]) => void) {
    this.socket.on(emit, cb);
  }
  off(emit: string, cb?: (...args: any[]) => void) {
    this.socket.off(emit, cb);
  }
  checkConnection() {
    if (import.meta.env.DEV) console.log('%c SOCKET: check ', 'background: #4856D6; color: #fff');
    this.timeoutCheck = window.setTimeout(() => {
      this.socket.disconnect();
      this.socket.connect();
    }, 1500);
    this.emit('check-connection', {}, (response: { status: boolean }) => {
      if (response.status) clearTimeout(this.timeoutCheck);
    });
  }
}

export default new SocketCommon();
