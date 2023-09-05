import axios, { Method } from 'axios';

type InitialSuccessResponse = { status: true; data: any };
type InitialFailedResponse = { status: false; message: string };

type InitialRequest = (options: {
  url: string;
  method: Method;
  headers?: Record<string, any>;
  data?: Record<string, any>;
  params?: Record<string, any>;
  timeout?: number;
}) => Promise<InitialSuccessResponse | InitialFailedResponse>;

export const axiosRequest: InitialRequest = async ({ url, method, data, params, headers, timeout }) => {
  try {
    const response = await axios({
      url,
      method,
      headers,
      data,
      params,
      timeout: timeout || 10_000,
      timeoutErrorMessage: 'Превышен лимит ожидания от сервера!',
    });
    return { status: true, data: response.data };
  } catch (err) {
    return { status: false, message: err instanceof Error ? err.message : String(err) };
  }
};
