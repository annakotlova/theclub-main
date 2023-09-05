import { Event } from '@/modules/event/dto/event.dto';
import { Payment } from '@/modules/payment/dto/payment.dto';
import { Transaction } from '@/modules/transaction/dto/transaction.dto';
import { User } from '@/modules/user/dto/user.dto';

const common_params_id = [{ id: '_id', required: true, type: 'string', name: 'Идентификатор' }];

const common_query_list = [
  { id: 'search', required: false, type: 'string', name: 'search' },
  { id: 'limit', required: false, type: 'string', name: 'limit' },
  { id: 'page', required: false, type: 'string', name: 'page' },
];

const user_list = [
  ...common_query_list,
  { id: 'started', required: false, type: 'number', name: 'Сортировать по' },
];
const common_user_list = [
  ...common_query_list,
  { id: 'user', required: false, type: 'string', name: 'user' },
];
const user_create = [
  { id: 'name', required: true, type: 'string', name: 'ФИО' },
  { id: 'phone', required: true, type: 'string', name: 'Номер телефона' },
  { id: 'number', required: true, type: 'number', name: 'Номер' },
];
const user_update = [
  { id: 'name', required: true, type: 'string', name: 'ФИО' },
  { id: 'login', required: false, type: 'string', name: 'Логин' },
  { id: 'about', required: false, type: 'string', name: 'Описание' },
  { id: 'birthday', required: false, type: 'string', name: 'День рождения' },
];
const user_update_subject = [
  { id: 'subjects', required: true, type: 'array', name: 'Тематика', enum: User.Subject },
];
const user_update_phone = [{ id: 'phone', required: true, type: 'string', name: 'Номер телефона' }];
const user_update_email = [{ id: 'email', required: true, type: 'string', name: 'Почта' }];
const user_validate_phone = [
  { id: 'phone', required: true, type: 'string', name: 'Номер телефона' },
  { id: 'code', required: true, type: 'string', name: 'Код подтверждения' },
];
const user_update_password = [
  { id: 'password', required: true, type: 'string', name: 'Новый пароль' },
  { id: 'repeatPassword', required: true, type: 'string', name: 'Повторите пароль' },
  { id: 'oldPassword', required: true, type: 'string', name: 'Текущий пароль' },
];

const transaction_list = [
  ...common_query_list,
  { id: 'started', required: false, type: 'number', name: 'Сортировать по' },
  { id: 'type', required: false, type: 'string', name: 'Тип транзакции', enum: Transaction.Type },
];

const event_list = [
  ...common_query_list,
  { id: 'sort', required: false, type: 'string', name: 'Сортировка', enum: Event.Sort },
  { id: 'category', required: false, type: 'string', name: 'Категория', enum: Event.Category },
  { id: 'organizer', required: false, type: 'string', name: 'Организатор', enum: Event.Organizer },
  { id: 'subject', required: false, type: 'string', name: 'Тематика', enum: User.Subject },
];
const event_create = [
  { id: 'name', required: true, type: 'string', name: 'Название' },
  { id: 'format', required: true, type: 'string', name: 'Формат', enum: Event.Format },
  { id: 'category', required: true, type: 'string', name: 'Категория', enum: Event.Category },
  { id: 'subject', required: true, type: 'string', name: 'Тематика', enum: User.Subject },
  { id: 'startedAt', required: true, type: 'date', name: 'Дата и время начала' },
  { id: 'period', required: true, type: 'number', name: 'Продолжительность' },
  { id: 'minMembers', required: true, type: 'number', name: 'Мин. кол-во участников' },
  { id: 'maxMembers', required: true, type: 'number', name: 'Макс. кол-во участников' },
  { id: 'content', required: true, type: 'string', name: 'Описание' },
  { id: 'link', required: false, type: 'string', name: 'Ссылка на мероприятие' },
  { id: 'place', required: false, type: 'string', name: 'Место проведения' },
  { id: 'additional', required: false, type: 'string', name: 'Дополнительные условия' },
];
const event_update = [
  { id: '_id', required: true, type: 'string', name: 'Идентификатор мероприятия' },
  ...event_create,
];
const event_update_support = [
  { id: '_id', required: true, type: 'string', name: 'Идентификатор мероприятия' },
  { id: 'selected', required: true, type: 'array', name: 'Список помощников' },
];
const event_approve_support = [
  { id: '_id', required: true, type: 'string', name: 'Идентификатор мероприятия' },
  { id: 'status', required: true, type: 'boolean', name: 'Статус принятия' },
];
const event_action = [
  { id: '_id', required: true, type: 'string', name: 'Идентификатор мероприятия' },
];
const event_cancel = [
  { id: '_id', required: true, type: 'string', name: 'Идентификатор мероприятия' },
];

const signin = [
  { id: 'phone', required: true, type: 'string', name: 'Номер телефона' },
  { id: 'password', required: true, type: 'string', name: 'Пароль' },
];
const signin_admin = [
  { id: 'email', required: true, type: 'string', name: 'Почта' },
  { id: 'password', required: true, type: 'string', name: 'Пароль' },
];
const send_code = [
  { id: 'phone', required: true, type: 'string', name: 'Телефон' },
  { id: 'referral', required: false, type: 'string', name: 'Реферальный код' },
];
const validate_code = [{ id: 'code', required: true, type: 'string', name: 'Проверочный код' }];
const signup = [
  { id: 'name', required: true, type: 'string', name: 'ФИО' },
  { id: 'password', required: true, type: 'string', name: 'Пароль' },
];

const recovery = [{ id: 'phone', required: true, type: 'string', name: 'Номер телефона' }];
const recovery_password = [
  { id: 'password', required: true, type: 'string', name: 'Пароль' },
  { id: 'repeatPassword', required: true, type: 'string', name: 'Повторите пароль' },
];

const payment_initial = [
  { id: 'tariff', required: true, type: 'string', name: 'Тариф подписки', enum: Payment.Tariff },
  { id: 'type', required: true, type: 'string', name: 'Тип подписки', enum: Payment.TariffType },
  { id: 'period', required: false, type: 'string', name: 'Срок рассрочки', enum: Payment.Credit },
];
const payment_reserve_initial = [
  { id: 'type', required: true, type: 'string', name: 'Тип подписки', enum: Payment.TariffType },
];
const payment_balance_initial = [
  { id: 'tariff', required: true, type: 'string', name: 'Тариф подписки', enum: Payment.Tariff },
];
const payment_credit_initial = [
  { id: 'credit', required: true, type: 'string', name: 'credit', enum: Payment.Credit },
  { id: 'tariff', required: true, type: 'string', name: 'tariff', enum: Payment.Tariff },
];
const payment_withdrawal = [{ id: 'amount', required: true, type: 'number', name: 'Сумма вывода' }];

const review_get_list = [{ id: 'event', required: true, type: 'string', name: 'event' }];
const review_create = [
  { id: 'event', required: true, type: 'string', name: 'event' },
  { id: 'rating', required: true, type: 'number', name: 'rating' },
  { id: 'description', required: false, type: 'string', name: 'description' },
];

const qrcode_validate = [{ id: 'code', required: true, type: 'string', name: 'code' }];

const notification_viewed = [{ id: 'list', required: true, type: 'array', name: 'list' }];

export default {
  user_list: { type: 'query', list: user_list },
  user_create: { type: 'body', list: user_create },
  user_update: { type: 'body', list: user_update },
  user_update_subject: { type: 'body', list: user_update_subject },
  user_update_password: { type: 'body', list: user_update_password },
  user_update_phone: { type: 'body', list: user_update_phone },
  user_update_email: { type: 'body', list: user_update_email },
  user_validate_phone: { type: 'body', list: user_validate_phone },

  event_list: { type: 'query', list: event_list },
  event_create: { type: 'body', list: event_create },
  event_update: { type: 'body', list: event_update },
  event_update_support: { type: 'body', list: event_update_support },
  event_approve_support: { type: 'body', list: event_approve_support },
  event_action: { type: 'body', list: event_action },
  event_cancel: { type: 'body', list: event_cancel },

  signin: { type: 'body', list: signin },
  signin_admin: { type: 'body', list: signin_admin },
  signup: { type: 'body', list: signup },
  send_code: { type: 'body', list: send_code },
  validate_code: { type: 'body', list: validate_code },

  recovery: { type: 'body', list: recovery },
  recovery_password: { type: 'body', list: recovery_password },

  payment_initial: { type: 'body', list: payment_initial },
  payment_withdrawal: { type: 'body', list: payment_withdrawal },
  payment_credit_initial: { type: 'body', list: payment_credit_initial },
  payment_reserve_initial: { type: 'body', list: payment_reserve_initial },
  payment_balance_initial: { type: 'body', list: payment_balance_initial },

  transaction_list: { type: 'query', list: transaction_list },

  review_get_list: { type: 'query', list: review_get_list },
  review_create: { type: 'body', list: review_create },

  qrcode_validate: { type: 'params', list: qrcode_validate },

  notification_viewed: { type: 'body', list: notification_viewed },

  common_params_id: { type: 'params', list: common_params_id },
  common_query_list: { type: 'query', list: common_query_list },
  common_user_list: { type: 'query', list: common_user_list },
};
