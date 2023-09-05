import { FilterQuery, UpdateQuery } from 'mongoose';
import { Request, Response } from 'express';

import eventService from './event.service';
import notificationService from '../notification/notification.service';
import qrcodeController from './qrcode/qrcode.controller';
import eventConstants from './event.constants';

import { Event } from './dto/event.dto';
import { User } from '../user/dto/user.dto';
import { Common } from '@/interfaces/common.dto';
import { GetEventDto } from './dto/get-event.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ActionEventDto } from './dto/action-event.dto';
import { SocketDto } from '../common/socket/dto/socket.dto';
import { Notification } from '../notification/dto/notification.dto';
import { UpdateSupportEventDto } from './dto/update-support-event.dto';
import { ActionWaitingEventDto } from './dto/action-waiting-event.dto';
import { GetMemberListEventDto } from './dto/get-member-list-event.dto';
import { ApproveSupportEventDto } from './dto/approve-support-event.dto';

import { Converter, VerifyEvent, Validator, VerifyRoles, Access } from '@/decorators';

import socket from '../common/socket';
import { eventCancelSchedule, eventSchedule } from '../common/schedule';

import dateFilter from '@/utils/date/date.filter';
import response, { ErrorHandler } from '@/utils/response';
import { defineFilter, definePagination } from '@/utils/define';

class EventController {
  @Access()
  @Validator('common_params_id')
  @ErrorHandler()
  async getItem(req: Request, res: Response) {
    const user = res.locals.user._id;
    const params = req.params as { _id: string };

    const eventFilters: Common.GetByFilters<Event.Dto> = {
      filters: { _id: params._id },
      populate: [
        { path: 'cover', select: 'type src cover' },
        {
          path: 'creator',
          select: 'avatar name login verified',
          populate: { path: 'avatar', select: 'type src cover' },
        },
      ],
      lean: true,
    };
    const event = await eventService.findOneByFilters(eventFilters);
    if (!event) return response.notFound(res, eventConstants.NOT_FOUND);

    event.isWaiting = !!event.waiting.find((m) => String(m._id) === user);
    event.isMember = !!event.members.find((m) => String(m._id) === user);
    event.qrcode = await qrcodeController.get(event._id, user);

    response.ok(res, null, event);
  }

  @Access()
  @VerifyEvent({ owner: true })
  @Validator('common_params_id')
  @ErrorHandler()
  async getCreatorItem(req: Request, res: Response) {
    const params = req.params as { _id: string };

    const eventFilters: Common.GetByFilters<Event.Dto> = {
      filters: { _id: params._id, status: Event.Status.CREATED },
      populate: { path: 'cover', select: 'type src cover' },
      lean: true,
    };
    const event = await eventService.findOneByFilters(eventFilters);
    if (!event) return response.notFound(res, eventConstants.NOT_FOUND);

    const difference = +new Date(event.endedAt) - +new Date(event.startedAt);
    event.period = String(difference / 60_000);

    response.ok(res, null, event);
  }

  @Access()
  @Converter('event_list')
  @ErrorHandler()
  async getList(req: Request, res: Response) {
    const user = res.locals.user;
    const query = req.query as GetEventDto;
    const options = { sort: {} as { startedAt?: -1 | 1; membersLength?: -1 } };
    const filters = { endedAt: { $gte: Date.now() + 1000 * 3600 } } as FilterQuery<Event.Dto>;

    if (user.role !== User.Role.ADMIN) filters.status = { $ne: Event.Status.BLOCKED };

    if (query.sort === Event.Sort.POPULAR) options.sort = { membersLength: -1 };
    else options.sort = { startedAt: query.sort === Event.Sort.NOVELTY ? -1 : 1 };

    if (query.search) filters.name = { $regex: query.search, $options: 'i' };

    definePagination(options, query);
    defineFilter(filters, req.query, [
      { name: 'category' },
      { name: 'organizer' },
      { name: 'subject' },
    ]);

    let populate = [
      { path: 'cover', select: 'type src cover' },
      {
        path: 'creator',
        select: 'avatar name login verified',
        populate: { path: 'avatar', select: 'type src cover' },
      },
    ];
    if (user.role === User.Role.ADMIN) {
      populate = [
        ...populate,
        { path: 'members', select: 'name phone' },
        { path: 'waiting', select: 'name phone' },
        { path: 'supports.member', select: 'name phone' },
      ];
    }

    const eventFilters: Common.GetByFilters<Event.Dto> = {
      filters,
      options,
      populate,
      lean: true,
    };
    const events = await eventService.findByFilters(eventFilters);
    const total = await eventService.count(eventFilters);

    const getQrcode = (event: Common.BaseModel['_id']) =>
      new Promise(async (resolve) => {
        resolve(await qrcodeController.get(event, user._id));
      });

    const requests = events.map((e) => getQrcode(e._id));
    const request = (await Promise.all(requests)) as Array<string>;
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      if (event) event.qrcode = request[i] || '';
    }

    for (const event of events) {
      event.isMember = !!event.members.find((m) => String(m._id) === user._id);
      event.isWaiting = !!event.waiting.find((m) => String(m._id) === user._id);
    }

    response.ok(res, null, events, total);
  }

  @Access()
  @VerifyRoles(User.Role.ADMIN)
  @Converter('common_query_list')
  @ErrorHandler()
  async getExpiredList(req: Request, res: Response) {
    const query = req.query as GetEventDto;
    const options = { sort: {} as { startedAt?: -1 | 1; membersLength?: -1 } };
    const filters = { endedAt: { $lte: Date.now() + 1000 * 3600 } } as FilterQuery<Event.Dto>;

    definePagination(options, query);

    const populate = [
      { path: 'cover', select: 'type src cover' },
      {
        path: 'creator',
        select: 'avatar name login verified',
        populate: { path: 'avatar', select: 'type src cover' },
      },
      { path: 'members', select: 'name phone' },
      { path: 'waiting', select: 'name phone' },
      { path: 'supports.member', select: 'name phone' },
    ];

    const eventFilters: Common.GetByFilters<Event.Dto> = {
      filters,
      options,
      populate,
      lean: true,
    };
    const events = await eventService.findByFilters(eventFilters);
    const total = await eventService.count(eventFilters);

    response.ok(res, null, events, total);
  }

  @Access()
  @ErrorHandler()
  async getJoinedList(_: Request, res: Response) {
    const user = res.locals.user._id;
    const eventFilters: Common.GetByFilters<Event.Dto> = {
      filters: {
        $or: [{ members: { $in: user } }, { creator: user }],
        endedAt: { $gte: Date.now() + 1000 * 3600 },
        status: { $ne: Event.Status.CANCELED },
      },
      options: { sort: { startedAt: 1 } },
      select: 'name startedAt endedAt status',
      lean: true,
    };
    const events = await eventService.findByFilters(eventFilters);

    const getQrcode = (event: Common.BaseModel['_id']) =>
      new Promise(async (resolve) => {
        resolve(await qrcodeController.get(event, user));
      });

    const requests = events.map((e) => getQrcode(e._id));
    const request = (await Promise.all(requests)) as Array<string>;
    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      if (event) event.qrcode = request[i] || '';
    }

    response.ok(res, null, events);
  }

  @Access()
  @VerifyEvent({ owner: true })
  @ErrorHandler()
  async getMemberList(req: Request, res: Response) {
    const query = req.query as GetMemberListEventDto;

    const eventFilters: Common.GetByFilters<Event.Dto> = {
      filters: { _id: query.event },
      select: 'members supports creator',
      populate: [
        {
          path: 'creator',
          select: 'name avatar',
          populate: { path: 'avatar', select: 'src cover type' },
        },
        {
          path: 'members',
          select: 'name avatar',
          populate: { path: 'avatar', select: 'src cover type' },
        },
        {
          path: 'supports',
          select: 'name avatar',
          populate: { path: 'avatar', select: 'src cover type' },
        },
      ],
    };
    const event = await eventService.findOneByFilters(eventFilters);
    if (!event) return response.notFound(res, eventConstants.NOT_FOUND);

    response.ok(res, null, event);
  }

  @Access()
  @Converter('event_create')
  @ErrorHandler()
  async create(req: Request, res: Response) {
    const user = res.locals.user;
    const dto = req.body as CreateEventDto;
    dto.organizer = user.role === User.Role.ADMIN ? Event.Organizer.CLUB : Event.Organizer.MEMBERS;
    dto.creator = user._id as any;

    const validate = this.validate(dto);
    if (!validate.status) return response.badRequest(res, validate.message);

    const event = await eventService.create(dto);
    response.created(res, null, event);

    eventSchedule(event);
  }

  @Access()
  @Converter('event_update')
  @ErrorHandler({ log: true })
  async update(req: Request, res: Response) {
    const dto = req.body as UpdateEventDto;

    const validate = this.validate(dto);
    if (!validate.status) return response.badRequest(res, validate.message);

    const eventUpdate: Common.UpdateByFilters<Event.Dto> = {
      filters: { _id: dto._id },
      update: dto,
    };
    const event = await eventService.update(eventUpdate);
    if (!event) return response.notFound(res, eventConstants.NOT_FOUND);
    if ([Event.Status.BLOCKED, Event.Status.CANCELED].includes(event.status))
      return response.badRequest(res, eventConstants.STATUS_ERROR);

    response.ok(res, eventConstants.UPDATE);

    socket.actions.event(event, SocketDto.EventAction.update);
    const dates = +new Date(event.startedAt) !== +new Date(dto.startedAt);
    const meta = { name: event.name } as Notification.Meta;
    const changes = [
      { status: event.name !== dto.name, type: Notification.Type.EVENT_UPDATE_NAME, meta: {} },
      {
        status: event.place !== dto.place,
        type: Notification.Type.EVENT_UPDATE_PLACE,
        meta: { place: dto.place },
      },
      {
        status: dates,
        type: Notification.Type.EVENT_UPDATE_DATE,
        meta: { startedAt: dto.startedAt },
      },
    ];
    for (const change of changes) {
      if (change.status) {
        await notificationService.create({
          event,
          users: event.members,
          type: change.type,
          meta: { ...meta, ...change.meta },
        });
      }
    }

    eventSchedule(event);
  }

  @Access()
  @VerifyEvent({ owner: true })
  @Converter('event_update_support')
  @ErrorHandler()
  async updateSupport(req: Request, res: Response) {
    const dto = req.body as UpdateSupportEventDto;

    const eventFilters: Common.GetByFilters<Event.Dto> = {
      filters: { _id: dto._id },
      select: 'name members supports status',
      lean: true,
    };
    const event = await eventService.findOneByFilters(eventFilters);
    if (!event) return response.notFound(res, eventConstants.NOT_FOUND);
    if ([Event.Status.BLOCKED, Event.Status.CANCELED].includes(event.status))
      return response.badRequest(res, eventConstants.STATUS_ERROR);

    const accesses = [
      { min: 100, max: 1000, value: 6 },
      { min: 50, max: 99, value: 4 },
      { min: 1, max: 10, value: 5 },
    ];
    const access = accesses.find(
      (a) => a.min <= event.members.length && a.max >= event.members.length,
    );
    if (!access) return response.badRequest(res, eventConstants.SUPPORT_SELECT_ERROR);

    if (access.value < dto.selected.length)
      return response.badRequest(res, eventConstants.SUPPORT_MAX_ERROR(access.value));

    const eventUpdate: Common.UpdateByFilters<Event.Dto> = {
      filters: { _id: event._id },
      update: { supports: dto.selected.map((s) => ({ member: s })) },
    };
    await eventService.update(eventUpdate);

    response.ok(res, eventConstants.SUPPORT_NOTIFICATION, event);

    for (const select of dto.selected) {
      const exist = event.supports.find((s) => String(s.member) === select);
      if (exist) {
        dto.selected = dto.selected.filter((s) => s !== String(exist.member._id));
        event.supports = event.supports.filter(
          (s) => String(s.member._id) !== String(exist.member._id),
        );
      }
    }

    const list = [
      { users: dto.selected, type: Notification.Type.SUPPORT_JOIN },
      { users: event.supports.map((s) => s.member), type: Notification.Type.SUPPORT_LEAVE },
    ];
    for (const item of list) {
      await notificationService.create({
        event,
        users: item.users,
        type: item.type,
        meta: { name: event.name },
      });
    }
  }

  @Access()
  @VerifyEvent({ support: true })
  @Converter('event_approve_support')
  @Validator('common_body_id')
  @ErrorHandler()
  async approveSupport(req: Request, res: Response) {
    const user = res.locals.user._id;
    const dto = req.body as ApproveSupportEventDto;

    const update = {} as UpdateQuery<Event.Dto>;
    if (dto.status) update['supports.$.approved'] = true;
    else update['$pull'] = { supports: { member: user } };

    const eventUpdate: Common.UpdateByFilters<Event.Dto> = {
      filters: { _id: dto._id, 'supports.member': user },
      update,
      updated: true,
      select: 'supports',
    };
    const event = await eventService.update(eventUpdate);
    response.ok(res, null, dto);

    if (!event) return;
    const notificationFilters: Common.UpdateByFilters<Notification.Dto> = {
      filters: { event, user, type: Notification.Type.SUPPORT_JOIN },
      update: { 'meta.approved': dto.status },
    };
    await notificationService.updateMany(notificationFilters);
  }

  @Access()
  @Converter('event_action')
  @ErrorHandler()
  async action(req: Request, res: Response) {
    const user = res.locals.user._id;
    const dto = req.body as ActionEventDto;

    const eventFilters: Common.GetByFilters<Event.Dto> = {
      filters: { _id: dto._id },
      select: 'members creator waiting maxMembers startedAt category status',
    };
    const event = await eventService.findOneByFilters(eventFilters);
    if (!event) return response.notFound(res, eventConstants.NOT_FOUND);
    if ([Event.Status.BLOCKED, Event.Status.CANCELED].includes(event.status))
      return response.badRequest(res, eventConstants.STATUS_ERROR);

    if (String(event.creator) === user)
      return response.badRequest(res, eventConstants.CREATOR_ERROR);

    const isMember = !!event.members.find((m) => String(m) === user);
    const isWaiting = !!event.waiting.find((m) => String(m) === user);
    const isWaitingJoin = event.members.length + 1 > event.maxMembers;

    const action = isMember || isWaiting ? Event.Action.leave : Event.Action.join;
    const isJoin = action === Event.Action.join;

    const currentDate = new Date();
    const startedAt = new Date(event.startedAt);

    if (isJoin && +currentDate >= +startedAt)
      return response.badRequest(res, eventConstants.JOIN_EVENT_ERROR);
    if (!isJoin && +currentDate >= +startedAt - 3_600_000)
      return response.badRequest(res, eventConstants.LEAVE_EVENT_ERROR);

    const update = {} as UpdateQuery<Event.Dto>;
    if (!isWaiting && !isWaitingJoin) update['$inc'] = { membersLength: isJoin ? 1 : -1 };

    const updateAction = isWaitingJoin && !isMember ? { waiting: user } : { members: user };
    update[isJoin ? '$push' : '$pull'] = updateAction;

    const eventUpdate: Common.UpdateByFilters<Event.Dto> = {
      filters: { _id: event._id },
      update,
      select: 'members waiting name startedAt endedAt content place',
      updated: true,
    };
    const updated = await eventService.update(eventUpdate);
    if (!updated) return response.notFound(res, eventConstants.NOT_FOUND);

    response.ok(res, null, {
      ...updated,
      isMember: isJoin && !isWaitingJoin,
      isWaiting: isJoin && isWaitingJoin,
    });

    socket.actions.event(updated, SocketDto.EventAction.update);

    const generateCodeAt = +startedAt - 2_400_000;
    if (generateCodeAt <= Date.now()) {
      if (isJoin && !isWaitingJoin && event.category === Event.Category.OFFLINE) {
        const code = await qrcodeController.create(event._id, user);
        console.log('---member---');
        console.log(code);
      }
    }

    const isVacancy = updated.waiting.length && event.members.length === event.maxMembers;
    if (!isJoin && isMember && isVacancy) {
      await notificationService.create({
        event,
        users: event.waiting,
        type: Notification.Type.WAITING_LIST,
        meta: { name: updated.name },
      });
    }
  }

  @Access()
  @VerifyEvent({ waiting: true })
  @Converter('event_action')
  @ErrorHandler()
  async actionWaiting(req: Request, res: Response) {
    const user = res.locals.user._id;
    const dto = req.body as ActionWaitingEventDto;

    const eventFilters: Common.GetByFilters<Event.Dto> = {
      filters: { _id: dto._id },
      select: 'members waiting maxMembers status',
    };
    const event = await eventService.findOneByFilters(eventFilters);
    if (!event) return response.notFound(res, eventConstants.NOT_FOUND);
    if ([Event.Status.BLOCKED, Event.Status.CANCELED].includes(event.status))
      return response.badRequest(res, eventConstants.STATUS_ERROR);
    if (event.members.length === event.maxMembers)
      return response.badRequest(res, eventConstants.MAX_MEMBER_ERROR);

    const eventUpdate: Common.UpdateByFilters<Event.Dto> = {
      filters: { _id: dto._id },
      update: { $pull: { waiting: user }, $push: { members: user }, $inc: { membersLength: 1 } },
      updated: true,
      select: 'waiting members',
    };
    const updated = await eventService.update(eventUpdate);
    response.ok(res, null, updated);

    const notificationFilters: Common.UpdateByFilters<Notification.Dto> = {
      filters: { event, user, type: Notification.Type.WAITING_LIST },
      update: { 'meta.approved': true },
    };
    await notificationService.updateMany(notificationFilters);
  }

  @Access()
  @VerifyRoles(User.Role.ADMIN)
  @Converter('event_action')
  @ErrorHandler()
  async block(req: Request, res: Response) {
    const dto = req.body as ActionEventDto;

    const eventUpdate: Common.UpdateByFilters<Event.Dto> = {
      filters: { _id: dto._id },
      update: { status: Event.Status.BLOCKED },
      updated: true,
    };
    const event = await eventService.update(eventUpdate);
    if (!event) return response.notFound(res, eventConstants.NOT_FOUND);

    const responsed = { _id: event._id, status: event.status };
    response.ok(res, null, responsed);
    socket.actions.event(responsed, SocketDto.EventAction.update);

    await notificationService.create({
      event,
      users: [event.creator],
      type: Notification.Type.EVENT_BLOCKED,
      meta: { name: event.name },
    });

    eventCancelSchedule(event._id);
  }

  @Access()
  @VerifyRoles(User.Role.ADMIN)
  @Converter('event_action')
  @ErrorHandler({ log: true })
  async unblock(req: Request, res: Response) {
    const dto = req.body as ActionEventDto;

    const eventUpdate: Common.UpdateByFilters<Event.Dto> = {
      filters: { _id: dto._id },
      update: { status: Event.Status.CREATED },
      updated: true,
    };
    const event = await eventService.update(eventUpdate);
    if (!event) return response.notFound(res, eventConstants.NOT_FOUND);

    const responsed = { _id: event._id, status: event.status };
    response.ok(res, null, responsed);
    socket.actions.event(responsed, SocketDto.EventAction.update);

    await notificationService.create({
      event,
      users: [event.creator],
      type: Notification.Type.EVENT_UNBLOCKED,
      meta: { name: event.name },
    });

    eventSchedule(event);
  }

  @Access()
  @VerifyEvent({ owner: true })
  @Converter('event_cancel')
  @ErrorHandler()
  async cancel(req: Request, res: Response) {
    const dto = req.body as ActionEventDto;

    const eventFilters: Common.GetByFilters<Event.Dto> = {
      filters: { _id: dto._id },
      select: 'startedAt',
    };
    const event = await eventService.findOneByFilters(eventFilters);
    if (!event) return response.notFound(res, eventConstants.NOT_FOUND);

    // TODO: if < 10 hours -rep
    const isCanceled = Date.now() + 3_600_000 <= +new Date(event.startedAt);
    if (!isCanceled) return response.badRequest(res, eventConstants.CANCELED_ERROR);

    const eventUpdate: Common.UpdateByFilters<Event.Dto> = {
      filters: { _id: dto._id },
      update: { status: Event.Status.CANCELED },
      updated: true,
      select: '_id name members waiting status',
    };
    const updated = await eventService.update(eventUpdate);
    if (!updated) return response.notFound(res, eventConstants.NOT_FOUND);

    const responsed = { _id: updated._id, status: updated.status };
    response.ok(res, null, responsed);

    socket.actions.event(responsed, SocketDto.EventAction.update);
    await notificationService.create({
      event,
      users: [...updated.members, ...updated.waiting],
      type: Notification.Type.EVENT_CANCELED,
      meta: { name: updated.name },
    });

    eventCancelSchedule(event._id);
  }

  @Access()
  @VerifyEvent({ owner: true })
  @Validator('common_params_id')
  @ErrorHandler()
  async delete(req: Request, res: Response) {
    const _id = req.params._id as string;
    const event = await eventService.delete({
      filters: {
        _id,
        status: { $in: [Event.Status.CREATED, Event.Status.BLOCKED, Event.Status.CANCELED] },
      },
    });

    response.ok(res, null, { _id });

    if (!event) return;
    socket.actions.event(event, SocketDto.EventAction.delete);
    await notificationService.create({
      event,
      users: [...event.members, ...event.waiting],
      type: Notification.Type.EVENT_CANCELED,
      meta: { name: event.name },
    });
  }

  @ErrorHandler({ request: false })
  async generateCodes(_id: Common.BaseModel['_id']) {
    const eventFilters: Common.GetByFilters<Event.Dto> = {
      filters: { _id, status: Event.Status.CREATED, category: Event.Category.OFFLINE },
      select: 'members',
    };
    const event = await eventService.findOneByFilters(eventFilters);
    if (!event) return false;

    const codes = await qrcodeController.createMany(event);
    console.log(codes);
    return true;
  }

  @ErrorHandler({ request: false })
  async updateStatus(_id: Common.BaseModel['_id'], status: Event.Status) {
    const eventUpdate: Common.UpdateByFilters<Event.Dto> = {
      filters: { _id },
      update: { status },
      updated: true,
      select: 'status',
    };
    const event = await eventService.update(eventUpdate);
    if (!event) return false;

    socket.actions.event(event, SocketDto.EventAction.update);
    return true;
  }

  validate(event: CreateEventDto | UpdateEventDto) {
    const started = new Date(event.startedAt);
    const ended = new Date(+started + 1000 * 60 * +event.period);

    // if (event.category === Event.Category.ONLINE && !isLink(event.link))
    //   return { status: false, message: eventConstants.REQUIRED_LINK_BY_ONLINE };
    // if (event.category === Event.Category.OFFLINE && !event.place)
    //   return { status: false, message: eventConstants.REQUIRED_PLACE_BY_OFFLINE };
    if (event.name.length < 3 || event.name.length > 100)
      return { status: false, message: eventConstants.NAME_LENGTH };
    if (event.content.length < 5 || event.content.length > 2000)
      return { status: false, message: eventConstants.CONTENT_LENGTH };

    if (event.minMembers >= event.maxMembers)
      return { status: false, message: eventConstants.MAX_LESS_MIN_LENGTH };
    if (event.minMembers < 10) return { status: false, message: eventConstants.MIN_MEMBERS_LENGTH };
    if (event.maxMembers > 1000)
      return { status: false, message: eventConstants.MAX_MEMBERS_LENGTH };

    if (+event.period < 45) return { status: false, message: eventConstants.MIN_PERIOD_LENGTH };
    if (+event.period > 180) return { status: false, message: eventConstants.MAX_PERIOD_LENGTH };

    if (Date.now() + 86_400_000 >= +started) {
      const date = dateFilter(Date.now() + 86_400_000, 'datetime');
      return {
        status: false,
        message: eventConstants.STARTED_CREATE_ERROR(date),
      };
    }
    if (isNaN(+started)) return { status: false, message: eventConstants.STARTED_ERROR };
    if (started.getHours() < 3 || started.getHours() >= 20)
      return { status: false, message: eventConstants.MIN_DATE_LIMIT };
    if (ended.getHours() > 18 || (ended.getHours() === 18 && ended.getMinutes() !== 0))
      return { status: false, message: eventConstants.MAX_DATE_LIMIT };

    event.endedAt = ended;
    return { status: true, message: '' };
  }
}

export default new EventController();
