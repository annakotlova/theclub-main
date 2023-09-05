import axios, { Axios } from 'axios';
import { Softpay } from './dto';

class SoftPay {
  axios: Axios;
  init() {
    this.axios = axios.create({
      baseURL: String(process.env.SOFTPAY_API),
      headers: { Authorization: String(process.env.SOFTPAY_KEY) },
    });
    console.log('SoftPay Module: ✅');
  }

  async create(product: string, customData: Record<string, any>) {
    try {
      const { data } = await this.axios.post(Softpay.RequestMethod.CREATE_ORDER, {
        product,
        customData,
      });
      return { status: true, data: { url: data?.data?.url } };
    } catch (error) {
      return { status: false };
    }
  }

  async bindCard(user: string) {
    try {
      const { data } = await this.axios.post(Softpay.RequestMethod.CONCLUSION_BIND, { user });
      return { status: true, data: data.data, message: '' };
    } catch (err: any) {
      return { status: false, data: null, message: err?.response?.data?.message };
    }
  }

  async withdrawal(user: string, amount: number) {
    try {
      const { data } = await this.axios.post(Softpay.RequestMethod.CONCLUSION_WITHDRAWAL, { user, amount });
      return { status: true, data: data.data, message: '' };
    } catch (err: any) {
      return { status: false, data: null, message: err?.response?.data?.message };
    }
  }

  async conclusion(amount: number) {
    try {
      await this.axios.post(Softpay.RequestMethod.CREATE_CONCLUSION, {
        amount: amount * 1,
        password: String(process.env.SOFTPAY_THECLUB_PASSWORD),
      });
      return true;
    } catch (_) {
      return false;
    }
  }
}

export default new SoftPay();
