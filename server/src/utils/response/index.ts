import { Response } from 'express';

export enum STATUS_CODE {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  TOO_MANY_REQUESTS = 429,
  SERVER = 500,
}

type HandlerFunction = (res: Response) => void;
type ResponseFunction = (
  res: Response,
  message?: string | null,
  data?: any,
  total?: number,
) => void;

class ResponseHandler {
  total?: number;
  data: any | null;
  status: boolean;
  statusCode: number;
  message: string | null;
  update(statusCode: number, message?: string | null, data?: any, total?: number) {
    this.status = [STATUS_CODE.OK, STATUS_CODE.CREATED].includes(statusCode);
    this.statusCode = statusCode;
    this.message = message || null;
    this.data = data || null;
    if (total) this.total = total;
    else delete this.total;
  }
}

const response = new ResponseHandler();
const handler: HandlerFunction = (res) => res.status(response.statusCode).json(response);

const ok: ResponseFunction = (res, message, data, total) => {
  response.update(STATUS_CODE.OK, message, data, total);
  handler(res);
};

const created: ResponseFunction = (res, message, data) => {
  response.update(STATUS_CODE.CREATED, message, data);
  handler(res);
};

const badRequest: ResponseFunction = (res, message, data) => {
  response.update(STATUS_CODE.BAD_REQUEST, message, data);
  handler(res);
};

const unauthorized: ResponseFunction = (res, message, data) => {
  response.update(STATUS_CODE.UNAUTHORIZED, message, data);
  handler(res);
};

const forbidden: ResponseFunction = (res, message, data) => {
  response.update(STATUS_CODE.FORBIDDEN, message, data);
  handler(res);
};

const notFound: ResponseFunction = (res, message, data) => {
  response.update(STATUS_CODE.NOT_FOUND, message, data);
  handler(res);
};

const conflict: ResponseFunction = (res, message, data) => {
  response.update(STATUS_CODE.CONFLICT, message, data);
  handler(res);
};

const server = (res: Response, err: any) => {
  res.status(STATUS_CODE.SERVER).json(err.message ? err.message : err);
};

export const ErrorHandler = ({ log, request }: { log?: boolean; request?: boolean } = { log: false, request: true }) => {
  return (
    target: Object,
    _: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>,
  ) => {
    const method = descriptor.value;
    descriptor.value = async (req, res, next) => {
      try {
        return await method?.apply(target, [req, res, next]);
      } catch (err) {
        if (err instanceof Error) {
          if (log) console.log(err);
          if (request) server(res, err);
          else return false;
        }
      }
    };
  };
};

export default {
  ok,
  created,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict,
  server,
};
