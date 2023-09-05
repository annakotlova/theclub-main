import { ApiWrapper } from '..';
import { Response } from '@/interfaces/common/index.dto';

interface ICardService {
  create(): Response<{ url: string }>;
  deleteItem(): Response<null>;
}

class CardAPI extends ApiWrapper implements ICardService {
  constructor() {
    super('/card', true);
  }
  /**
   * Привязать карту
   */
  async create(): Response<{ url: string }> {
    return await this.post('');
  }
  /**
   * Отвязать карту
   */
  async deleteItem(): Response<null> {
    return await this.delete(``);
  }
}

export default new CardAPI();
