import dateFilter from '@/utils/date/date.filter';

export default {
  types: {
    DEFAULT: () => '',
    WARNING: () => '',
    
    WAITING_LIST: (name: string) => `На мероприятие "${name}" появились свободные места.`,
    SUPPORT_SELECT: (name: string) => `На вашем мероприятиии "${name}" собралось более 25 участников. Вы можете добавить помощника из списка участников.`,
    SUPPORT_JOIN: (name: string) => `Организатор мероприятия "${name}" приглашает вас стать помощником мероприятия.`,
    SUPPORT_LEAVE: (name: string) => `Организатор мероприятия "${name}" убрал вас из списка помощников мероприятия.`,
    // TODO: ???
    EVENT_LEAVE: () => '',
    EVENT_REVIEW: (name: string) => `Вы посетили мероприятие "${name}", поделитесь своими впечатлениями.`,
    EVENT_BLOCKED: (name: string) => `Ваше мероприятие "${name}" было заблокировано администрацией.`,
    EVENT_UNBLOCKED: (name: string) => `Ваше мероприятие "${name}" было разблокировано администрацией.`,
    EVENT_CANCELED: (name: string) => `Мероприятие "${name}" было отменено.`,
    EVENT_CANCELED_MEMBER: (name: string) => `Мероприятие "${name}" не собрало нужное количество участников.`,
    EVENT_UPDATE_PLACE: (name: string, place: string) => `В мероприятии "${name}" было изменено место проведения на: ${place}`,
    EVENT_UPDATE_NAME: (name: string, current: string) => `Название мероприятия "${name}" было изменено на: ${current}`,
    EVENT_UPDATE_DATE: (name: string, startedAt: string) => `В мероприятии "${name}" было изменено время проведения на: ${dateFilter(startedAt, 'datetime')}`,
  }
}