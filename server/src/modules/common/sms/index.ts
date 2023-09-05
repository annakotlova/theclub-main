import axios, { Axios } from 'axios';
import { SmsSend } from './dto/sms.dto';

class Sms {
  key: string;
  axios: Axios;
  init() {
    this.key = String(process.env.SMS_KEY);
    this.axios = axios.create({ baseURL: String(process.env.SMS_API) });
    console.log('Sms Module: ✅');
  }
  async sendSms(dto: SmsSend, priority = 1) {
    try {
      const response = await this.axios.get('', {
        params: {
          method: 'push_msg',
          format: 'json',
          key: this.key,
          text: dto.text,
          phone: dto.phone,
          sender_name: 'TheClub',
          priority,
        },
      });
      console.log(response.data);
      return response?.data?.response?.msg?.err_code === '0';
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

export default new Sms();
