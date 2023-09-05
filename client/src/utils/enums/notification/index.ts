export const NOTIFICATION_MESSAGE = {
  ENTER_PHONE: 'Введите номер телефона!',
  REFERRAL_VALIDATE_ERROR: 'Реферальная ссылка некорректна! Проверьте, пожалуйста, реферальный код!',
  UPLOAD_IMAGE_TYPE: 'Загрузить можно только файлы с расширением jpeg, jpg, png, webp!',
  ONLINE_STATUS: 'Ты снова онлайн!',
  OFFLINE_STATUS: 'Ты не в сети :( Изменения не будут сохранены!',
  UNVALID_DATE: 'Введите корректную дату в формате дд.мм.гггг!',

  EVENT_JOIN: 'Вы успешно подписались на мероприятие!',
  EVENT_LEAVE: 'Вы успешно отписались от мероприятия',

  FILL_FIELDS: 'Заполните все обязательные поля!',
  COPY_LINK: 'Ссылка скопирована в буфер обмена!',
  COPY_EVENT_LINK: 'Ссылка на мероприятие скопирована в буфер обмена!',

  MAX_ATTACHMENT_UPLOAD: (max: number) => `Максимальное количество файлов: ${max}`,
  SELECT_DROP_ELEMENT: (name: string) =>
    `Вам необходимо выбрать вариант из списка в поле "${name}"!`,
  MAX_FILE_SIZE: (name: string, size: string) =>
    `Файл "${name}" превышает допустимый размер файла (${size})!`,
};