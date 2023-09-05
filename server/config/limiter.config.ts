import { Options } from 'express-rate-limit';

export const getLimiterOptions = (): Partial<Options> => ({
  windowMs: 2 * 60 * 1000,
  statusCode: 429,
  max: 2000,
});
