import { Request, Response } from 'express';

import qrcodeService from './qrcode.service';
import qrcodeConstants from './qrcode.constants';
import eventConstants from '../event.constants';

import { Event } from '../dto/event.dto';
import { QrCode } from './dto/qrcode.dto';
import { Common } from '@/interfaces/common.dto';
import { ValidateQrcodeDto } from './dto/validate-qrcode.dto';

import { Converter, Access, Validator, VerifyEvent } from '@/decorators';

import response, { ErrorHandler } from '@/utils/response';
import { generateCodes } from '@/utils/common/codes';

class QrCodeController {
  @Access()
  @Converter('qrcode_validate')
  @ErrorHandler()
  async validate(req: Request, res: Response) {
    const user = res.locals.user._id;
    const params = req.params as ValidateQrcodeDto;

    const qrcodeFilters: Common.GetByFilters<QrCode.Dto> = {
      filters: { code: params.code },
      populate: [
        {
          path: 'event',
          select: 'name startedAt supports creator place',
          populate: { path: 'cover', select: 'src cover' },
        },
        { path: 'member', select: 'name phone', populate: { path: 'avatar', select: 'src cover' } },
      ],
    };
    const qrcode = await qrcodeService.findOneByFilters(qrcodeFilters);
    if (!qrcode) return response.notFound(res, qrcodeConstants.NOT_FOUND);
    if (!qrcode.event) return response.notFound(res, eventConstants.NOT_FOUND);

    const isCreator = String(qrcode.event.creator) === user;
    const isSupport = !!qrcode.event.supports.find((s) => String(s.member) !== user);
    if (!isSupport && !isCreator) return response.badRequest(res, qrcodeConstants.SUPPORT_ERROR);

    response.ok(res, null, qrcode);
  }

  @Access()
  @VerifyEvent({ support: true })
  @Validator('common_body_id')
  @ErrorHandler()
  async approve(req: Request, res: Response) {
    const user = res.locals.user._id;
    const dto = req.body as { _id: string };

    const qrcodeUpdate: Common.UpdateByFilters<QrCode.Dto> = {
      filters: { _id: dto._id, status: QrCode.Status.CREATED },
      update: { status: QrCode.Status.CONFIRMED, support: user },
      updated: true,
      select: 'status',
    };
    const qrcode = await qrcodeService.update(qrcodeUpdate);
    if (!qrcode) return response.notFound(res, qrcodeConstants.NOT_FOUND);

    response.ok(res, null, qrcode);
  }

  async get(event: Common.BaseModel['_id'], member: Common.BaseModel['_id']) {
    const qrcodeFilters: Common.GetByFilters<QrCode.Dto> = {
      filters: { event, member },
      select: 'code',
      lean: true,
    };
    const qrcode = await qrcodeService.findOneByFilters(qrcodeFilters);
    if (!qrcode) return '';

    const link = process.env.QRCODE_URL || '';
    return link + qrcode.code;
  }

  async create(event: Common.BaseModel['_id'], member: Common.BaseModel['_id']) {
    const code = generateCodes({ length: 24, count: 1 }) as string;
    const dto = { event, member, code } as any;

    return await qrcodeService.create(dto);
  }

  async expired(event: Common.BaseModel['_id']) {
    const qrcodeUpdate: Common.UpdateByFilters<QrCode.Dto> = {
      filters: { event, status: QrCode.Status.CREATED },
      update: { status: QrCode.Status.EXPIRED },
    };
    await qrcodeService.updateMany(qrcodeUpdate);
  }

  async createMany(event: Event.Dto) {
    const dtos = event.members.map((m) => ({
      member: m,
      event,
      code: generateCodes({ length: 24, count: 1 }) as string,
    }));

    return await qrcodeService.insertMany(dtos);
  }
}

export default new QrCodeController();
