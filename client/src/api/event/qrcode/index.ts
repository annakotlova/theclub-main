import { ApiWrapper } from '../..';
import { Response } from '@/interfaces/common/index.dto';
import { QrCodeDto } from '@/interfaces/qrcode/qrcode.dto';

class QrCodeAPI extends ApiWrapper {
  constructor() {
    super('/qrcode', true);
  }
  /**
   * Валидация кода
   */
  async validate(code: string): Response<QrCodeDto> {
    return await this.get(`/${code}`);
  }
  /**
   * Апруд кода
   */
  async approve(_id: string, event: string): Response<QrCodeDto> {
    return await this.patch('/approve', { _id, event });
  }
}
export default new QrCodeAPI();
