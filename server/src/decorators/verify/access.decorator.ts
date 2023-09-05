import userService from '@/modules/user/user.service';
import constants from '@/middlewares/constants';

import { Common } from '@/interfaces/common.dto';

import response from '@/utils/response';
import { createToken, setCookieToken, verifyJWT } from '@/utils/token';

export const Access = () => {
  return (
    target: Object,
    _: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>,
  ) => {
    const method = descriptor.value;
    descriptor.value = async (req, res, next) => {
      const token = req.cookies.token;
      const refresh = req.cookies.refresh;
      if (!token || !refresh) return response.unauthorized(res);

      let verifyAccess = verifyJWT(token, Common.TokenType.ACCESS);
      if (!verifyAccess) {
        const verifyRefresh = verifyJWT(refresh, Common.TokenType.REFRESH);
        if (!verifyRefresh) return response.unauthorized(res, constants.TOKEN_LIFETIME);

        const data = { _id: verifyRefresh._id, role: verifyRefresh.role };
        verifyAccess = data;

        const token = createToken(data, Common.TokenType.ACCESS);
        setCookieToken({ token }, res);

        const exist = await userService.exists({ filters: { _id: data._id } });
        if (!exist) return response.forbidden(res, constants.FORBIDDEN);
      }

      res.locals.user = { _id: verifyAccess._id, role: verifyAccess.role };
      req.query.identificator = res.locals.user._id;

      return await method?.apply(target, [req, res, next]);
    };
  };
};

export const AccessMiddleware: Common.ExpressFunction = async (req, res, next) => {
  const token = req.cookies.token;
  const refresh = req.cookies.refresh;
  if (!token || !refresh) return response.unauthorized(res);

  let verifyAccess = verifyJWT(token, Common.TokenType.ACCESS);
  if (!verifyAccess) {
    const verifyRefresh = verifyJWT(refresh, Common.TokenType.REFRESH);
    if (!verifyRefresh) return response.unauthorized(res, constants.TOKEN_LIFETIME);

    const data = { _id: verifyRefresh._id, role: verifyRefresh.role };
    verifyAccess = data;

    const token = createToken(data, Common.TokenType.ACCESS);
    setCookieToken({ token }, res);

    const exist = await userService.exists({ filters: { _id: data._id } });
    if (!exist) return response.forbidden(res, constants.FORBIDDEN);
  }

  res.locals.user = { _id: verifyAccess._id, role: verifyAccess.role };
  req.query.identificator = res.locals.user._id;

  next();
};
