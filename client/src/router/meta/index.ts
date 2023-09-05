export default {
  main: {
    index: {
      id: 'main',
      auth: true,
      layout: 'main',
      section: 'main',
      title: 'Главная',
    },
  },

  event: {
    list: {
      id: 'event-list',
      auth: true,
      layout: 'main',
      section: 'event',
      title: 'Список мероприятий',
    },
    create: {
      id: 'event-create',
      auth: true,
      layout: 'main',
      section: 'event',
      title: 'Создание мероприятия',
    },
    update: {
      id: 'event-update',
      auth: true,
      layout: 'main',
      section: 'event',
      title: 'Редактирование мероприятия',
    },
    code: {
      id: 'event-code',
      auth: true,
      layout: 'main',
      section: 'event',
      title: 'Qr Code',
    },
  },

  profile: {
    index: {
      id: 'profile',
      auth: true,
      layout: 'main',
      section: 'profile',
      title: 'Профиль',
      images: ['/src/assets/images/profile.webp'],
    },
    logout: {
      id: 'profile-logout',
      auth: true,
      layout: 'main',
      section: 'profile',
      title: 'Выход',
    },
  },

  start: {
    index: {
      id: 'start',
      auth: true,
      layout: 'payment',
      section: 'start',
      title: 'С чего начать?',
    },
    subject: {
      id: 'start-subject',
      auth: true,
      layout: 'payment',
      section: 'start',
      title: 'Выбор тематики',
    },
  },

  payment: {
    index: {
      id: 'payment',
      auth: true,
      layout: 'payment',
      section: 'payment',
      title: 'Оплата подписки',
    },
    confirmed: {
      id: 'payment-confirmed',
      auth: true,
      layout: 'payment',
      section: 'payment',
      title: 'Успешная оплата',
    },
    rejected: {
      id: 'payment-rejected',
      auth: true,
      layout: 'payment',
      section: 'payment',
      title: 'Ошибка оплаты',
    },
  },

  auth: {
    signin: {
      id: 'signin',
      auth: false,
      layout: 'auth',
      section: 'auth',
      title: 'Авторизация',
    },
    signup: {
      id: 'signup',
      auth: false,
      layout: 'auth',
      section: 'auth',
      title: 'Регистрация',
    },
    signup_code: {
      id: 'signup_code',
      auth: false,
      layout: 'auth',
      section: 'auth',
      title: 'Проверочный код',
    },
    signup_verify: {
      id: 'signup_verify',
      auth: false,
      layout: 'auth',
      section: 'auth',
      title: 'Подтвержение',
    },
    recovery: {
      id: 'recovery',
      auth: false,
      layout: 'auth',
      section: 'auth',
      title: 'Восстановление пароля',
    },
    recovery_code: {
      id: 'recovery_code',
      auth: false,
      layout: 'auth',
      section: 'auth',
      title: 'Проверочный код',
    },
    recovery_verify: {
      id: 'recovery_verify',
      auth: false,
      layout: 'auth',
      section: 'auth',
      title: 'Подтвержение',
    },
  },
};
