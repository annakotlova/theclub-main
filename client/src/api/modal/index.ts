import { AxiosRequestConfig } from 'axios';
import { ApiWrapper } from '..';
import { Response } from '@/interfaces/common/index.dto';

interface IModalService {
  submit(config: AxiosRequestConfig): Response<Record<string, any>>;
}

class ModalAPI extends ApiWrapper implements IModalService {
  constructor() {
    super('', true);
  }
  /**
   * Получение данных по заказу
   */
  async submit(config: AxiosRequestConfig): Response<Record<string, any>> {
    return await this._axios.request(config);
  }
}

export default new ModalAPI();
