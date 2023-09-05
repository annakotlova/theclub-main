export enum SocketEvent {
  JOIN_ROOM = 'room-join',
  LEAVE_ROOM = 'room-leave',
  CARD_ACTION = 'card-action',
  USER_ACTION = 'user-action',
  EVENT_ACTION = 'event-action',
  COMMON_ACTION = 'common-action',
  NOTIFICATION_ACTION = 'notification-action',
}

// Common
export type SocketUserAction = 'update' | 'delete' | 'active';
export type SocketEventAction = 'create' | 'update' | 'delete';
export type SocketCommonAction = 'create' | 'update' | 'delete';
export type SocketNotificationAction = 'create' | 'update' | 'delete';
