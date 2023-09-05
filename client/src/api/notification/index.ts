import { ApiWrapper } from '..';
import { Response } from '@/interfaces/common/index.dto';
import { NotificationDto } from '@/interfaces/notification/notification.dto';

class NotificationAPI extends ApiWrapper {
  constructor() {
    super('/notification', true);
  }
  /**
   * Получение списка уведомлений пользователя
   */
  async getList(): Response<Array<NotificationDto>> {
    return await this.get('/list');
  }
  /**
   * Обновить статус уведомлений
   */
  async updateViewed(list: Array<string>): Response<void> {
    return await this.patch('/viewed', { list });
  }
}
export default new NotificationAPI();
