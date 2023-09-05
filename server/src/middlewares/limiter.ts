import rateLimit from 'express-rate-limit';

import constants from './constants';

import { STATUS_CODE } from '@/utils/response';

const limiterOptions = {
  ms: 60_000,
  max: 10,
};

export default (max?: number, message?: string, ms?: number) => {
  return rateLimit({
    windowMs: ms || limiterOptions.ms,
    message: {
      status: false,
      statusCode: STATUS_CODE.TOO_MANY_REQUESTS,
      message: message || constants.RAGE_LIMIT,
      data: null,
    },
    // skipFailedRequests: true,
    max: max || limiterOptions.max,
    keyGenerator: (request, response) => {
      const user = response.locals.user?._id;
      return `${request.ip}-${user || ''}`;
    },
  });
};
