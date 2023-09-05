export default {
  COMMON: (code: string) => `Новый проверочный код The Club: ${code}`,
  SIGNUP: (code: string) => `Проверочный код для регистрации аккаунта The Club: ${code}`,
  RECOVERY: (code: string) => `Проверочный код для восстановления пароля The Club: ${code}`,
  SUBSCRIPTION_SCHEDULE: (name: string, date: string) =>
    `${name}, Ваша подписка THE CLUB заканчивается ${date}, зайдите в систему для оплаты!`,
  SUBSCRIPTION_CANCEL: (name: string) =>
    `${name}, Ваша подписка THE CLUB закончилась, зайдите в систему для оплаты!`,
};
