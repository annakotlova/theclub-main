import axios, { Axios, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useRouter } from 'vue-router';

// import { useModalStore } from '@/store/modal';
import { useGlobalStore } from '@/store/global';
import { useNotificationStore } from '@/store/notification';
import { NotificationDto } from '@/plugins/notification/typings/notification.dto';
import { Response } from '@/interfaces/common/index.dto';

const callNotification = (message: string, type: NotificationDto['type'], timeout = 5000) => {
  useNotificationStore().create({ message, type, timeout });
};

sessionStorage.clear();
const URL = import.meta.env.VITE_URL + '/api';
export class ApiWrapper {
  protected _axios: Axios;
  constructor(path: string, _ = false) {
    this._axios = axios.create({
      withCredentials: true,
      baseURL: URL + path,
    });
    this._axios.interceptors.request.use(this.requestHandler);
    this._axios.interceptors.response.use(this.responseSuccess, this.responseError);
    // if (csrf) this.setCSRFToken();
  }
  get(url: string, config?: AxiosRequestConfig): Response<any> {
    return this._axios.get(url, config);
  }
  getBlob(url: string, config?: AxiosRequestConfig): Promise<Blob> {
    return this._axios.get(url, config);
  }
  post(url: string, data?: unknown, config?: AxiosRequestConfig): Response<any> {
    return this._axios.post(url, data, config);
  }
  patch(url: string, data?: unknown, config?: AxiosRequestConfig): Response<any> {
    return this._axios.patch(url, data, config);
  }
  delete(url: string, config?: AxiosRequestConfig): Response<any> {
    return this._axios.delete(url, config);
  }
  private requestHandler(config: AxiosRequestConfig) {
    // if (config.headers) config.headers['Access-Control-Allow-Origin'] = '*';
    return config;
  }
  private responseSuccess(response: AxiosResponse<any, any>) {
    if (response.data.message) callNotification(response.data.message, 'info');
    useGlobalStore().updatePendingStatus(false);
    return response.data;
  }
  private responseError(error: AxiosError<any, any>) {
    useGlobalStore().updatePendingStatus(false);
    const res = error.response;
    if (!res) return Promise.reject(error);

    if (res.status === 401) {
      if (res.config.url === '/authentication') return;
      // if (!res.config.baseURL?.includes('/auth')) return location.reload();
      if (res.data.message) callNotification(res.data.message, 'error');
    } else if (res.status === 403) {
      callNotification(res.data.message, 'error');
      // useModalStore().destroy();
      if (res.config.method === 'get') useRouter().back();
    } else if (!res.data.status && res.data.message && res.status !== 401) {
      callNotification(res.data.message, 'error', 8000);
    } else if (res.status === 500) {
      callNotification('Упс, что-то пошло не так :(', 'error');
    }

    return Promise.reject(error);
  }
  // async getCSRFToken() {
  //   const { data } = await axios({
  //     method: 'get',
  //     withCredentials: true,
  //     url: URL + '/auth/csrf',
  //   });
  //   sessionStorage.setItem('csrf', data.data.token);
  //   return String(data.data.token);
  // }
  // async setCSRFToken() {
  //   let csrf = sessionStorage.getItem('csrf');
  //   if (!csrf) csrf = await this.getCSRFToken();

  //   this._axios.defaults.headers.post['X-CSRF-TOKEN'] = csrf;
  //   this._axios.defaults.headers.put['X-CSRF-TOKEN'] = csrf;
  //   this._axios.defaults.headers.patch['X-CSRF-TOKEN'] = csrf;
  //   this._axios.defaults.headers.delete['X-CSRF-TOKEN'] = csrf;
  // }
}
