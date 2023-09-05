import { Socket as SocketType } from 'socket.io';

type Parameters = { _id: string; room: string };

export namespace SocketDto {
  export enum CommonEvent {
    ROOM_JOIN = 'room-join',
    ROOM_LEAVE = 'room-leave',
    DISCONNECT = 'disconnect',
    CHECK_CONNECTION = 'check-connection',
  }
  export enum Event {
    NOTIFICATION = 'notification-action',
    COMMON = 'common-action',
    EVENT = 'event-action',
    USER = 'user-action',
    CARD = 'card-action',
  }
  export enum CardAction {
    create = 'create',
  }
  export enum NotificationAction {
    create = 'create',
    update = 'update',
    delete = 'delete',
  }
  export enum UserAction {
    update = 'update',
    delete = 'delete',
    action = 'action',
  }
  export enum CommonAction {
    create = 'create',
    update = 'update',
    delete = 'delete',
  }
  export enum EventAction {
    create = 'create',
    update = 'update',
    delete = 'delete',
  }

  export type RoomFunction = (socket: SocketType) => (data: Parameters, cb: (data: { status: boolean }) => void) => void;
}
