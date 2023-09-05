import { ApiWrapper } from '..';
import { Response } from '@/interfaces/common/index.dto';
import { ReferralDto } from '@/interfaces/referral/referral.dto';

interface IReferralService {
  getItem(type: 'limit' | 'all'): Response<ReferralDto>;
  validate(code: string): Response<{ _id: string }>;
}

class ReferralAPI extends ApiWrapper implements IReferralService {
  constructor() {
    super('/referral', true);
  }
  /**
   * Получение сущности реферала пользователя
   */
  async getItem(type: 'limit' | 'all'): Response<ReferralDto> {
    return await this.get('', { params: { type } });
  }
  /**
   * Получение сущности реферала пользователя
   */
  async validate(code: string): Response<ReferralDto> {
    return await this.get('/validate', { params: { code } });
  }
  /**
   * Просмотр новых рефераллов
   */
  async viewed(): Response<null> {
    return await this.patch('/viewed');
  }
}
export default new ReferralAPI();
