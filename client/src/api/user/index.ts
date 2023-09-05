import { ApiWrapper } from '..';
import { Response } from '@/interfaces/common/index.dto';
import { UserDto, UserSubjectCommon } from '@/interfaces/user/user.dto';

type UpdateSubjectR = Pick<UserDto, '_id' | 'subjects'>;

class UserAPI extends ApiWrapper {
  constructor() {
    super('/user', true);
  }
  /**
   * Обновить тематики пользователя
   */
  async updateSubjects(subjects: Array<UserSubjectCommon>): Response<UpdateSubjectR> {
    return await this.patch('/subject', { subjects });
  }
  /**
   * Обновить номер телефона пользователя
   */
  async updatePhone(data: { phone: string }): Response<Partial<UserDto>> {
    return await this.patch('/phone', data);
  }
  /**
   * Обновить номер телефона пользователя
   */
  async validatePhone(data: { phone: string, code: string }): Response<Partial<UserDto>> {
    return await this.patch('/phone/validate', data);
  }
}
export default new UserAPI();
