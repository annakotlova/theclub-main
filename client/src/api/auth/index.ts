import { ApiWrapper } from '..';
import { Response } from '@/interfaces/common/index.dto';
import { UserDto } from '@/interfaces/user/user.dto';

type RecoveryBody = Pick<UserDto, 'phone'>;
type SignInBody = Pick<UserDto, 'phone' | 'password'>;
type SendCodeBody = Pick<UserDto, 'phone'>;
type ValidateCodeBody = { code: string };
type SignUpBody = Pick<UserDto, 'name' | 'password'>;
type RecoveryPasswordBody = { password: string; repeatPassword: string };

interface IAuthService {
  authentication(): Response<UserDto>;
  sendCode(data: SendCodeBody): Response<{ code: string }>;
  validateCode(data: ValidateCodeBody): Response<null>;
  signup(data: SignUpBody): Response<UserDto>;
  signin(data: SignInBody): Response<UserDto>;
  recovery(data: RecoveryBody): Response<null>;
  logout(): Response<null>;
}

class AuthAPI extends ApiWrapper implements IAuthService {
  constructor() {
    super('/auth', true);
  }
  /**
   * Аутентификация пользователя
   */
  async authentication(): Response<UserDto> {
    return await this.get('/authentication');
  }
  /**
   * Отправка проверочного кода на номер телефона
   */
  async sendCode(data: SendCodeBody, referral?: string | null): Response<{ code: string }> {
    return await this.post('/send/code', { ...data, referral });
  }
  /**
   * Повторная отправка проверочного кода на номер телефона
   */
  async resendCode(): Response<{ code: string }> {
    return await this.post('/resend/code');
  }
  /**
   * Проверка кода
   */
  async validateCode(data: ValidateCodeBody): Response<null> {
    return await this.post('/validate/code', data);
  }
  /**
   * Регистрация пользователя
   */
  async signup(data: SignUpBody): Response<UserDto> {
    return await this.post('/signup', data);
  }
  /**
   * Авторизация пользователя
   */
  async signin(data: SignInBody): Response<UserDto> {
    return await this.post('/signin', data);
  }
  /**
   * Восстановление пароля
   */
  async recovery(data: RecoveryBody): Response<null> {
    return this.post('/recovery', data);
  }
  /**
   * Проверка кода
   */
  async recoveryCode(data: ValidateCodeBody): Response<null> {
    return this.post('/recovery/code', data);
  }
  /**
   * Сброс пароля
   */
  async recoveryPassword(data: RecoveryPasswordBody): Response<null> {
    return await this.post('/recovery/password', data);
  }
  /**
   * Выход из профиля
   */
  async logout(): Response<null> {
    return await this.post('/logout');
  }
}
export default new AuthAPI();
