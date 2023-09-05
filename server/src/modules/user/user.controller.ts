import { FilterQuery } from 'mongoose';
import { Request, Response } from 'express';

import excelController from '../excel/excel.controller';
import cardService from '../card/card.service';
import userService from './user.service';
import paymentService from '../payment/payment.service';
import referralService from '../referral/referral.service';
import transactionService from '../transaction/transaction.service';

import userConstants from './user.constants';
import authConstants from '../auth/auth.constants';

import sms from '../common/sms';

import { User } from './dto/user.dto';
import { Common } from '@/interfaces/common.dto';
import { Payment } from '../payment/dto/payment.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserListDto } from './dto/get-user-list.dto';
import { ChangeEmailUserDto } from './dto/change-email-user.dto';
import { ChangePhoneUserDto } from './dto/change-phone-user.dto';
import { UpdateSubjectUserDto } from './dto/update-subject-user.dto';
import { ValidatePhoneUserDto } from './dto/validate-phone-user.dto';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';

import { VerifyRoles, Access, Converter, Validator } from '@/decorators';

import response, { ErrorHandler } from '@/utils/response';
import { createToken, setCookieToken } from '@/utils/token';
import { generateCodes } from '@/utils/common/codes';
import { validationPassword } from '@/utils/password';
import { definePagination } from '@/utils/define';

class UserController {
  @Access()
  @VerifyRoles(User.Role.ADMIN)
  @Converter('user_list')
  @ErrorHandler()
  async getList(req: Request, res: Response) {
    const query = req.query as Common.GetList & GetUserListDto;
    const options = { sort: { createdAt: -1 } };
    const filters = { role: { $ne: User.Role.ADMIN } } as FilterQuery<User.Dto>;
    definePagination(options, query);

    if (query.started) filters.createdAt = { $gte: +query.started };

    const userFilters: Common.GetByFilters<User.Dto> = {
      filters,
      options,
      select: 'name phone role number email createdAt activated',
      lean: true,
    };
    const users = await userService.findByFilters(userFilters);
    const total = await userService.count(userFilters);

    const paymentFilters: Common.GetByFilters<Payment.Dto> = {
      filters: { user: { $in: users.map((u) => u._id) } },
      select: 'subscriptionAt createdAt user',
      lean: true,
    };
    const payments = await paymentService.findByFilters(paymentFilters);
    for (const user of users) {
      const payment = payments.find((p) => String(p.user) === String(user._id));
      if (!payment) continue;
      user.subscription = user.activated ? payment.subscriptionAt : undefined;
    }

    response.ok(res, null, users, total);
  }

  @Access()
  @VerifyRoles(User.Role.ADMIN)
  @ErrorHandler()
  async getExcel(_: Request, res: Response) {
    const userFilters: Common.GetByFilters<User.Dto> = {
      filters: { role: { $ne: User.Role.ADMIN } },
      options: { sort: { createdAt: -1 } },
      select: 'name phone role number email activated createdAt',
      lean: true,
    };
    const users = await userService.findByFilters(userFilters);

    const wb = await excelController.createUserExcel(users);
    wb.write(`Список транзакций.xlsx`, res);
  }

  @Access()
  @Converter('user_create')
  @ErrorHandler()
  async create(req: Request, res: Response) {
    const dto = req.body as { name: string; phone: string; number: string };

    const password = generateCodes({ length: 12, count: 1 }) as string;
    const userCreate = {
      name: dto.name,
      phone: dto.phone,
      password: userService.createPassword(password),
      activated: false,
      number: +dto.number,
    };
    const user = await userService.create(userCreate);
    await Promise.all([referralService.create(user._id), paymentService.create(user._id)]);

    response.ok(res, null, user);
  }

  @Access()
  @Converter('user_update')
  @ErrorHandler()
  async update(req: Request, res: Response) {
    const _id = res.locals.user._id;
    const dto = req.body as UpdateUserDto;

    const birthday = new Date(dto.birthday);
    const year = birthday.getFullYear();

    if (year < 1900 || year > new Date().getFullYear() - 10 || +birthday === 0)
      return response.badRequest(res, userConstants.BIRTHDAY_ERROR);

    if (dto.name.length < 6 || dto.name.length > 150)
      return response.badRequest(res, userConstants.NAME_LENGTH);
    if (dto.about.length > 1000) return response.badRequest(res, userConstants.MAX_ABOUT_LENGTH);

    const userUpdate: Common.UpdateByFilters<User.Dto> = {
      filters: { _id },
      update: { name: dto.name, about: dto.about, birthday: dto.birthday },
      updated: true,
    };
    const user = await userService.update(userUpdate);
    if (!user) return response.notFound(res, userConstants.NOT_FOUND);

    response.ok(res, null, { ...dto, _id });
  }

  @Access()
  @Converter('user_update_password')
  @Validator('common_password')
  @ErrorHandler()
  async updatePassword(req: Request, res: Response) {
    const _id = res.locals.user._id;
    const dto = req.body as UpdatePasswordUserDto;

    const userFilters: Common.GetByFilters<User.Dto> = {
      filters: { _id },
      select: 'password',
    };
    const user = await userService.findOneByFilters(userFilters);
    if (!user) return response.notFound(res, userConstants.NOT_FOUND);

    const validatePassword = validationPassword(dto.oldPassword, user.password);
    if (!validatePassword) return response.badRequest(res, userConstants.UNVALID_CURRENT_PASSWORD);

    if (dto.password !== dto.repeatPassword)
      return response.badRequest(res, userConstants.PASSWORD_NOT_MATCH);

    if (dto.password.length < 6 || dto.password.length > 30)
      return response.badRequest(res, userConstants.PASSWORD_LENGTH);

    const userUpdate: Common.UpdateDoc<User.Dto> = {
      doc: user,
      update: { password: userService.createPassword(dto.password) },
    };
    await userService.updateDoc(userUpdate);

    response.ok(res, userConstants.CHANGE_PASSWORD, { _id: user._id });
  }

  @Access()
  @Converter('user_update_subject')
  @ErrorHandler()
  async updateSubject(req: Request, res: Response) {
    const _id = res.locals.user._id;
    const dto = req.body as UpdateSubjectUserDto;

    const userUpdate: Common.UpdateByFilters<User.Dto> = {
      filters: { _id },
      update: { subjects: dto.subjects },
      updated: true,
      select: 'subjects',
    };
    const user = await userService.update(userUpdate);
    if (!user) return response.notFound(res, userConstants.NOT_FOUND);

    response.ok(res, null, user);
  }

  @Access()
  @Converter('user_update_phone')
  @Validator('common_phone')
  @ErrorHandler()
  async updatePhone(req: Request, res: Response) {
    const _id = res.locals.user._id;
    const dto = req.body as ChangePhoneUserDto;

    const userFilters: Common.GetByFilters<User.Dto> = {
      filters: { _id: { $ne: _id }, phone: dto.phone },
    };
    const exist = await userService.exists(userFilters);
    if (exist) return response.badRequest(res, userConstants.EXIST_PHONE);

    const code = generateCodes({ count: 1, length: 4, type: 'numberset' });
    const codeToken = createToken({ phone: dto.phone, code }, Common.TokenType.CODE);
    setCookieToken({ code: codeToken }, res);

    const message = await sms.sendSms({
      phone: dto.phone,
      text: `Проверочный код для смены номера телефона: ${code}`,
    });
    if (!message) return response.badRequest(res, authConstants.SEND_CODE_ERROR);

    response.ok(res);
  }

  @Access()
  @VerifyRoles(User.Role.ADMIN)
  @Converter('user_update_email')
  @Validator('common_email')
  @ErrorHandler()
  async updateEmail(req: Request, res: Response) {
    const _id = res.locals.user._id;
    const dto = req.body as ChangeEmailUserDto;

    const userFilters: Common.GetByFilters<User.Dto> = {
      filters: { _id: { $ne: _id }, email: dto.email },
    };
    const exist = await userService.exists(userFilters);
    if (exist) return response.badRequest(res, userConstants.EXIST_EMAIL);

    const userUpdate: Common.UpdateByFilters<User.Dto> = {
      filters: { _id },
      update: { email: dto.email },
    };
    await userService.update(userUpdate);

    response.ok(res, userConstants.CHANGE_EMAIL, { _id, email: dto.email });
  }

  @Access()
  @Converter('user_validate_phone')
  @Validator('common_phone')
  @ErrorHandler()
  async validatePhone(req: Request, res: Response) {
    const code = res.locals.code;
    const _id = res.locals.user._id;
    const dto = req.body as ValidatePhoneUserDto;

    if (+code.code !== +dto.code)
      return response.badRequest(res, authConstants.INVALID_VALIDATE_CODE);

    const userUpdate: Common.UpdateByFilters<User.Dto> = {
      filters: { _id },
      select: '_id phone',
      update: { phone: code.phone },
      updated: true,
    };
    const user = await userService.update(userUpdate);
    if (!user) return response.notFound(res, userConstants.NOT_FOUND);

    response.ok(res, null, user);
  }

  @Access()
  @VerifyRoles(User.Role.ADMIN)
  @Validator('common_params_id')
  @ErrorHandler()
  async delete(req: Request, res: Response) {
    const _id = req.params._id as string;
    await userService.delete({ filters: { _id } });

    const filters = { filters: { user: _id } };
    await Promise.all([
      transactionService.deleteMany(filters),
      paymentService.deleteMany(filters),
      cardService.deleteMany(filters),
      referralService.deleteMany(filters),
    ]);

    response.ok(res, null, { _id });
  }

  @ErrorHandler()
  async deleteUnactive() {
    const userFilters: Common.GetByFilters<User.Dto> = {
      filters: {
        activated: false,
        role: User.Role.USER,
        createdAt: { $lte: Date.now() - 432_000_000 },
      },
      select: '_id',
    };
    const users = await userService.findByFilters(userFilters);
    const filters = { user: { $in: users.map((u) => u._id) } };
    await Promise.all([
      userService.deleteMany(userFilters),
      referralService.deleteMany({ filters }),
      paymentService.deleteMany({ filters }),
    ]);
  }
}

export default new UserController();
