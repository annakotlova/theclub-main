export const SEND_CODE_INPUTS = {
  inputs: [
    {
      grid: '1 / 13',
      id: 'phone',
      type: 'text',
      name: 'Номер телефона',
      placeholder: '+7(999)999-99-99',
      mask: '+7(###)###-##-##',
      show: true,
      required: true,
      autofocus: true,
    },
  ],
  data: {
    phone: '',
  },
  classList: 'flex-column',
};

export const SIGNUP_INPUTS = {
  inputs: [
    {
      grid: '1 / 13',
      id: 'name',
      type: 'text',
      name: 'ФИО',
      placeholder: 'Введите ФИО',
      show: true,
      required: true,
      autofocus: true,
    },
    {
      grid: '1 / 13',
      id: 'password',
      type: 'password',
      name: 'Пароль',
      placeholder: 'Введите пароль',
      show: true,
      required: true,
    },
  ],
  data: {
    name: '',
    password: '',
  },
  classList: 'flex-column',
};

export const SIGNIN_INPUTS = {
  inputs: [
    {
      grid: '1 / 13',
      id: 'phone',
      type: 'text',
      name: 'Номер телефона',
      placeholder: '+7(999)999-99-99',
      mask: '+7(###)###-##-##',
      show: true,
      required: true,
    },
    {
      grid: '1 / 13',
      id: 'password',
      type: 'password',
      name: 'Пароль',
      placeholder: 'Введите пароль',
      show: true,
      required: true,
    },
  ],
  data: {
    phone: '',
    password: '',
  },
  classList: 'flex-column',
};

export const RECOVERY_INPUTS = {
  inputs: [
    {
      grid: '1 / 13',
      id: 'password',
      type: 'password',
      name: 'Пароль',
      placeholder: 'Введите пароль',
      show: true,
      required: true,
      autofocus: true,
    },
    {
      grid: '1 / 13',
      id: 'repeatPassword',
      type: 'password',
      name: 'Повторите пароль',
      placeholder: 'Введите пароль',
      show: true,
      required: true,
    },
  ],
  data: {
    password: '',
    repeatPassword: '',
  },
  classList: 'flex-column',
};

