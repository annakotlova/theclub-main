import constants from '@/middlewares/constants';
import { User } from '@/modules/user/dto/user.dto';

import response from '@/utils/response';

export const VerifyRoles = (...accesses: Array<User.Role>) => {
  return (
    target: Object,
    _: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>,
  ) => {
    const method = descriptor.value;
    descriptor.value = async (req, res, next) => {
      const role = res.locals.user?.role;
      if (role && !accesses.includes(role)) return response.forbidden(res, constants.FORBIDDEN);

      return await method?.apply(target, [req, res, next]);
    };
  };
};
