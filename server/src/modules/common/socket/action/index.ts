import socket from '..';

import { SocketDto } from '../dto/socket.dto';
import { User } from '@/modules/user/dto/user.dto';
import { Card } from '@/modules/card/dto/card.dto';
import { Event } from '@/modules/event/dto/event.dto';

/**
 * Отправка эмита user-action
 * @param _id Идентификатор пользователя
 * @param data Объект пользователя
 * @param action Действие над пользователем
 */
const user = (data: User.Dto, action: SocketDto.UserAction) => {
  const object = socket.getSocketObject(String(data._id));
  if (!object) return;

  object.emit(SocketDto.Event.USER, { data, action });
};

/**
 * Отправка эмита card-action
 * @param _id Идентификатор пользователя
 * @param data Объект карты
 * @param action Действие над картой
 */
const card = (_id: string, data: Card.Dto, action: SocketDto.CardAction) => {
  const object = socket.getSocketObject(_id);
  if (!object) return;

  object.emit(SocketDto.Event.CARD, { data, action });
};

/**
 * Отправка эмита common-action
 * @param _id Идентификатор пользователя
 * @param data Что угодно
 * @param action Действие
 */
const common = (_id: string, data: any, action: SocketDto.CommonAction) => {
  const object = socket.getSocketObject(_id);
  if (!object) return;

  object.emit(SocketDto.Event.COMMON, { data, action });
};

/**
 * Отправка эмита event-action
 * @param _id Идентификатор пользователя
 * @param data Объект мероприятия
 * @param action Действие
 */
const event = (data: Partial<Event.Dto>, action: SocketDto.EventAction) => {
  socket.io.emit(SocketDto.Event.EVENT, { data, action });
};

/**
 * Отправка эмита notification-action
 * @param _id Идентификатор пользователя
 * @param data Объект уведомления
 * @param action Действие
 */
const notification = (data: any, action: SocketDto.NotificationAction) => {
  const object = socket.getSocketObject(String(data.user?._id || data.user));
  if (!object) return;

  object.emit(SocketDto.Event.NOTIFICATION, { data, action });
};

export default {
  notification,
  common,
  event,
  user,
  card,
};
