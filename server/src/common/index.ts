import { Express } from 'express';

import modulesCommon from './modules.common';
import mongoCommon from './mongo.common';
import routesCommon from './routes.common';
import serverCommon from './server.common';
// import swaggerCommon from './swagger.common';

export default (app: Express) => {
  modulesCommon(app);
  // swaggerCommon(app);
  routesCommon(app);
  mongoCommon();
  serverCommon(app);
};
