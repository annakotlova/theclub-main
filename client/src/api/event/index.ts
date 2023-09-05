import { EventDto } from '@/interfaces/event/event.dto';
import { ApiWrapper } from '..';
import { CommonQuery, Response, ResponseWithTotal } from '@/interfaces/common/index.dto';

class EventAPI extends ApiWrapper {
  constructor() {
    super('/event', true);
  }
  /**
   * Получение массива мероприятий платформы
   */
  async getList(query: CommonQuery): ResponseWithTotal<Array<EventDto>> {
    return await this.get('/list', { params: query });
  }
  /**
   * Получение массива мероприятий пользователя
   */
  async getJoinedList(): Response<Array<EventDto>> {
    return await this.get(`/list/joined`);
  }
  /**
   * Получение списка участников и помощников мероприятия
   */
  async getMemberList(event: string): Response<EventDto> {
    return await this.get(`/member/list`, { params: { event } });
  }
  /**
   * Получение данных мероприятия по идентификатору
   */
  async getItem(_id: string): Response<EventDto> {
    return await this.get(`/${_id}`);
  }
  /**
   * Получение данных создателя мероприятия по идентификатору
   */
  async getCreatorItem(_id: string): Response<EventDto> {
    return await this.get(`/creator/${_id}`);
  }
  /**
   * Редактирование мероприятия
   */
  async update(dto: EventDto): Response<EventDto> {
    return await this.patch(``, dto);
  }
  /**
   * Редактирование мероприятия
   */
  async approveSupport(dto: { _id: string, status: boolean }): Response<EventDto> {
    return await this.patch(`/support/approve`, dto);
  }
  /**
   * Подписаться или отписаться от мероприятия
   */
  async action(_id: string): Response<EventDto> {
    return await this.patch(`/action`, { _id });
  }
  /**
   * Подписаться на мероприятие из листа ожидания
   */
  async actionWaiting(_id: string): Response<EventDto> {
    return await this.patch(`/action/waiting`, { _id });
  }
}
export default new EventAPI();
