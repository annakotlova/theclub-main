import { IValidator } from './dto/validator.dto';

export const isEmail: IValidator.ItemFunction = (check) => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return !!regex.test(check.toLowerCase());
};

export const isMobilePhone: IValidator.ItemFunction = (check) => {
  const regex = /^(\+?7)?\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
  return !!regex.test(check);
};

export const isObjectId: IValidator.ItemFunction = (check) => {
  const regex = /^[0-9a-fA-F]{24}$/;
  return !!regex.test(check);
};

export const isLink: IValidator.ItemFunction = (check) => {
  const regex = /(https?:\/\/[^\s]+)/g;
  return !!regex.test(check);
};

export const isPassword: IValidator.ItemFunction = (check) => {
  const regex = /^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d).*$/;
  return !!regex.test(check);
};

export const validator_messages = {
  EMAIL_ERROR: 'Введите корректный Email!',
  PASSWORD_ERROR:
    'Пароль должен содержать не менее 6 символов, содержать латинские буквы (A-Z, a-z), цифры (0-9) и специальные символы (!, @, #, $, %, ^, &, *)!',
  OBJECTID_ERROR: 'Некорректный идентификатор!',
  PHONE_ERROR: 'Введите корректный номер телефона!',
  LINK_ERROR: 'Введите корректную ссылку!',
};

export const validator_types = {
  email: { check: isEmail, message: validator_messages.EMAIL_ERROR },
  password: { check: isPassword, message: validator_messages.PASSWORD_ERROR },
  phone: { check: isMobilePhone, message: validator_messages.PHONE_ERROR },
  link: { check: isLink, message: validator_messages.LINK_ERROR },
  objectid: { check: isObjectId, message: validator_messages.OBJECTID_ERROR },
};

export const validators = {
  user_update: { type: 'body', list: { phone: 'phone' } },
  user_update_password: {
    type: 'body',
    list: { password: 'password', repeatPassword: 'password' },
  },

  common_email: { type: 'body', list: { email: 'email' } },
  common_phone: { type: 'body', list: { phone: 'phone' } },
  common_password: { type: 'body', list: { password: 'password' } },
  common_params_id: { type: 'params', list: { _id: 'objectid' } },
  common_query_id: { type: 'query', list: { _id: 'objectid' } },
  common_body_id: { type: 'body', list: { _id: 'objectid' } },

  recovery: { type: 'body', list: { phone: 'phone' } },

  common_user_list: { type: 'query', list: { user: 'objectid' } },
};
