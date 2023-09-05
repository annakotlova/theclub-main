declare global {
  interface Math {
    ceil10(value: number, exp: number): number;
  }
}
export interface SocketResponse {
  status: boolean;
  data?: Record<string, any>;
  message?: string;
}

export interface TimestampDto {
  _id: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export enum CommonFilter {
  ALL = 'ALL',
}

export interface CommonObject {
  _id: string;
  name: string;
}

export interface CommonQuery {
  page: number;
  limit: number;
  [key: string]: string | number | boolean | string[] | number[];
}

export interface IconProps {
  src?: string;
  size?: string;
  alt?: string;
  classList?: string;
}

export type ResponseObject<T> = {
  data: T;
  message: string;
  status: boolean;
  statusCode: number;
  total: number;
};
export type Response<T> = Promise<ResponseObject<T>>;
export type ResponseExcel = Promise<Blob>;
export type ResponseWithTotal<T> = Promise<ResponseObject<T>>;
