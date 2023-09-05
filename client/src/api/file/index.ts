import { ApiWrapper } from '..';
import { Response } from '@/interfaces/common/index.dto';
import { UserDto } from '@/interfaces/user/user.dto';
import { AxiosRequestConfig } from 'axios';

interface IFileService {
  updateUser(formData: FormData, config: AxiosRequestConfig<any>): Response<UserDto>;
}

class FileAPI extends ApiWrapper implements IFileService {
  constructor() {
    super('/file', true);
  }
  /**
   * Изменение аватара пользователя
   */
  async updateUser(formData: FormData, config: AxiosRequestConfig<any>): Response<UserDto> {
    return await this.patch('/user/avatar', formData, config);
  }
  /**
   * Изменение обложки мероприятия
   */
  async updateEventCover(formData: FormData): Response<UserDto> {
    return await this.patch('/event/cover', formData);
  }
}

export default new FileAPI();
