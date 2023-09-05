import { FilterQuery } from 'mongoose';

import eventConstants from '@/modules/event/event.constants';
import eventService from '@/modules/event/event.service';

import { Common } from '@/interfaces/common.dto';
import { Event } from '@/modules/event/dto/event.dto';

import response from '@/utils/response';
import { User } from '@/modules/user/dto/user.dto';

interface Status {
  owner?: boolean;
  support?: boolean;
  member?: boolean;
  waiting?: boolean;
}

export const VerifyEvent = ({ owner, support, member, waiting }: Status) => {
  return (
    target: Object,
    _: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>,
  ) => {
    const method = descriptor.value;
    descriptor.value = async (req, res, next) => {
      const _id = req.body.event || req.body._id || req.params._id || req.query._id || req.query.event;
      const user = res.locals.user._id;
      const role = res.locals.user.role;
      const filters = { _id, status: { $ne: Event.Status.BLOCKED } } as FilterQuery<Event.Dto>;

      if (role !== User.Role.ADMIN) {
        if (owner) filters.creator = user;
        else if (support) filters.$or = [{ creator: user }, { 'supports.member': user }];
        else if (member) filters.$or = [{ creator: user }, { members: { $in: user } }];
        else if (waiting) filters.waiting = { $in: user };
        else filters.$or = [{ creator: user }, { members: { $in: user } }];
      }

      const eventFilters: Common.GetByFilters<Event.Dto> = {
        filters,
      };
      const event = await eventService.exists(eventFilters);
      if (!event) return response.forbidden(res, eventConstants.FORBIDDEN);

      return await method?.apply(target, [req, res, next]);
    };
  };
};
