import { Request, Response } from 'express';
import xlsx from 'node-xlsx';
import fs from 'fs/promises';
import path from 'path';

import fileService from './file.service';
import userService from '../user/user.service';
import eventService from '../event/event.service';
import paymentService from '../payment/payment.service';
import referralService from '../referral/referral.service';

import fileConstants from './file.constants';
import userConstants from '../user/user.constants';

import { File } from './dto/file.dto';
import { User } from '../user/dto/user.dto';
import { Event } from '../event/dto/event.dto';
import { Common } from '@/interfaces/common.dto';
import { CreateFileDto } from './dto/create-file.dto';
import { GenerateFileDto } from './dto/generate-file.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

import { Validator, Access } from '@/decorators';

import { convertSizeImage } from '../common/sharp';
import { generateCodes } from '@/utils/common/codes';
import response, { ErrorHandler } from '@/utils/response';
import { isMobilePhone, validator_messages } from '@/decorators/validator/constants';

class FileController {
  @ErrorHandler()
  async uploadUser(req: Request, res: Response) {
    const patrion = !!req.query.patrion;
    if (!req.file) return response.badRequest(res, fileConstants.NOT_FOUND);

    const excel = xlsx.parse(req.file.buffer);
    if (!excel[0]?.data) return response.badRequest(res, fileConstants.NOT_FOUND);
    if (excel[0].data[0]?.join('-') !== 'ФИО-Телефон')
      return response.badRequest(res, fileConstants.INCORRECT_USER_UPLOAD_FORMAT);
    excel[0].data.shift();

    let errors = [] as Array<string>;
    let length = 0;
    const dtos = [] as Array<CreateUserDto>;

    for (const user of excel[0].data) {
      if (!user[0] || !user[1]) continue;

      const phone = String(user[1]);
      const validatePhone = isMobilePhone(phone);
      if (!validatePhone) errors = [...errors, validator_messages.PHONE_ERROR + ` ${phone}`];

      length++;
      const password = String(generateCodes({ count: 1, length: 16 }));
      dtos.push({
        name: String(user[0]),
        phone: `+${phone}`,
        password,
        activated: true,
        role: patrion ? User.Role.PATRION : User.Role.USER,
        number: length,
      });
    }

    const userFilters: Common.GetByFilters<User.Dto> = {
      filters: { phone: { $in: dtos.map((u) => u.phone) } },
      select: 'phone',
      lean: true,
    };
    const exists = await userService.findByFilters(userFilters);
    if (exists.length)
      errors = errors.concat(...exists.map((u) => userConstants.EXIST_PHONE + ` ${u.phone}`));
    if (errors.length) return response.badRequest(res, errors.join(' --- '));

    const users = await userService.createMany(dtos);
    const ids = users.map((u) => u._id);
    await Promise.all([referralService.createMany(ids), paymentService.createMany(ids)]);

    console.log(users);
    response.ok(res);
  }

  @Access()
  @ErrorHandler()
  async updateUserAvatar(req: Request, res: Response) {
    const _id = res.locals.user._id;
    const file = req.file as Express.Multer.File;
    const orientation = req.body.orientation || '-1';
    if (!file) return response.notFound(res, fileConstants.NOT_FOUND);

    const userFilters: Common.GetByFilters<User.Dto> = {
      filters: { _id },
      select: 'avatar',
      populate: { path: 'avatar', select: 'src type cover' },
    };
    const user = await userService.findOneByFilters(userFilters);
    if (!user) return response.notFound(res, userConstants.NOT_FOUND);

    if (user.avatar) await this.deleteDirectory(process.env.USER_FOLDER + `/${user._id}`);

    const fileGenerate: GenerateFileDto = {
      multerFile: file,
      creator: _id,
      path: `/upload/user/${user._id}`,
      sharpType: 'user',
    };
    const avatar = await this.generate(fileGenerate, orientation);
    if (!avatar) return response.badRequest(res, fileConstants.CREATE_ERROR);

    const userUpdate: Common.UpdateDoc<User.Dto> = {
      doc: user,
      update: { avatar },
    };
    await userService.updateDoc(userUpdate);

    response.ok(res, null, { _id: user._id, avatar });
  }

  @Access()
  @Validator('common_query_id')
  @ErrorHandler()
  async updateEventCover(req: Request, res: Response) {
    const user = res.locals.user?._id;
    const _id = req.body._id as string;
    const file = req.file as Express.Multer.File;
    const orientation = req.body.orientation || '-1';
    if (!file) return response.notFound(res, fileConstants.NOT_FOUND);

    const eventFilters: Common.GetByFilters<Event.Dto> = {
      filters: { _id },
      select: 'cover',
      populate: { path: 'cover', select: 'src type cover' },
    };
    const event = await eventService.findOneByFilters(eventFilters);
    if (!event) return response.notFound(res, userConstants.NOT_FOUND);

    if (event.cover) await this.deleteDirectory(process.env.EVENT_FOLDER + `/${event._id}`);

    const fileGenerate: GenerateFileDto = {
      multerFile: file,
      creator: user,
      path: `/upload/event/${event._id}`,
      sharpType: 'event',
    };
    const cover = await this.generate(fileGenerate, orientation);
    if (!cover) return response.badRequest(res, fileConstants.CREATE_ERROR);

    const eventUpdate: Common.UpdateDoc<Event.Dto> = {
      doc: event,
      update: { cover },
    };
    await eventService.updateDoc(eventUpdate);

    response.ok(res, null, { _id: event._id, cover });
  }

  @Access()
  @Validator('common_params_id')
  @ErrorHandler()
  async deleteUserAvatar(req: Request, res: Response) {
    const user = res.locals.user._id;
    const _id = req.params._id as string;

    const fileFilters: Common.GetByFilters<File.Dto> = {
      filters: { _id },
    };
    const file = await fileService.delete(fileFilters);
    if (!file) return response.ok(res);

    response.ok(res);

    const userUpdate: Common.UpdateByFilters<User.Dto> = {
      filters: { _id: user },
      update: { avatar: null },
    };
    await Promise.all([this.deleteFile(file), userService.update(userUpdate)]);
  }

  @ErrorHandler({ request: false })
  async generate(data: GenerateFileDto, orientation: string) {
    let src = `${data.path}/${data.multerFile.filename}`;
    if (data.sharpType) {
      const image = await convertSizeImage(data.multerFile, data.sharpType);
      src = `${data.path}/resize_main_${image}`;
    }

    const fileCreate: CreateFileDto = {
      src,
      name: data.multerFile.filename,
      size: data.multerFile.size,
      meta: { orientation },
      cover: src.replace('resize_', 'cover_'),
      type: File.Type.IMAGE,
      creator: data.creator,
    };
    return await fileService.create(fileCreate);
  }

  @ErrorHandler({ request: false })
  async deleteDirectory(directory: string, dir = false) {
    if (dir) {
      await fs.rm(directory, { recursive: true, force: true });
    } else {
      const dir = await fs.readdir(directory);
      for (const file of dir) {
        if (file.includes('resize_') || file.includes('cover_'))
          await fs.unlink(path.join(directory, file));
      }
    }
  }

  @ErrorHandler({ request: false })
  async deleteFileEntity(_id: string) {
    const fileFilters: Common.GetByFilters<File.Dto> = {
      filters: { _id },
    };
    const file = await fileService.findOneByFilters(fileFilters);
    if (!file) return true;

    await Promise.all([this.deleteFile(file), fileService.delete(fileFilters)]);
    return true;
  }

  @ErrorHandler({ request: false })
  async deleteFile(file: File.Dto) {
    if (file.src) {
      const link = process.env.FILE_FOLDER + file.src;
      const cover_link = link.replace('resize_', 'cover_');
      await fs.access(link);
      await fs.unlink(link);
      await fs.unlink(cover_link);
    }
  }
}

export default new FileController();
