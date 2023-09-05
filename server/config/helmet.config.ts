import { HelmetOptions } from 'helmet';

export const getHelmetOptions = (): HelmetOptions => ({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      'default-src': ["'self'"],
      'connect-src': ["'self'"],
      'img-src': ['*', "'self'", 'data:', 'https:', 'blob:'],
      'script-src': ["'self'"],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});
