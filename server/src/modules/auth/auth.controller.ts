import { Request, Response } from 'express';

import userService from '../user/user.service';
import paymentService from '../payment/payment.service';
import referralService from '../referral/referral.service';

import authConstants from './auth.constants';
import userConstants from '../user/user.constants';
import smsConstants from '../common/sms/sms.constants';

import sms from '../common/sms';

import { User } from '../user/dto/user.dto';
import { Common } from '@/interfaces/common.dto';
import { SigninAuthDto } from './dto/signin-auth.dto';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { RecoveryAuthDto } from './dto/recovery-auth.dto';
import { SendCodeAuthDto } from './dto/send-code-auth.dto';
import { SigninAdminAuthDto } from './dto/signin-admin-auth.dto';
import { RecoveryCodeAuthDto } from './dto/recovery-code-auth.dto';
import { ValidateCodeAuthDto } from './dto/validate-code-auth.dto';
import { RecoveryPasswordAuthDto } from './dto/recovery-password-auth.dto';

import { Converter, Validator, Access } from '@/decorators';

import response, { ErrorHandler } from '@/utils/response';
import { generateCodes } from '@/utils/common/codes';
import { validationPassword } from '@/utils/password';
import { createToken, removeCookieToken, setCookieToken } from '@/utils/token';

class AuthController {
  @Access()
  @ErrorHandler()
  async authentication(_: Request, res: Response) {
    const userFilters: Common.GetByFilters<User.Dto> = {
      filters: { _id: res.locals.user._id },
      select: '-password -onlinedAt -createdAt -updatedAt',
      populate: [{ path: 'avatar', select: 'src cover meta' }],
    };
    const user = await userService.findOneByFilters(userFilters);
    if (!user) return response.badRequest(res, userConstants.NOT_FOUND);

    response.ok(res, null, user);
  }

  // @Limiter(2)
  @ErrorHandler()
  async getCSRF(_: Request, res: Response) {
    response.ok(res, null, { token: '' });
  }

  @Converter('signin')
  @Validator('common_phone')
  @ErrorHandler()
  async signin(req: Request, res: Response) {
    const dto = req.body as SigninAuthDto;

    const userFilters: Common.GetByFilters<User.Dto> = {
      filters: { phone: dto.phone },
      select: 'phone name role password',
    };
    const user = await userService.findOneByFilters(userFilters);
    if (!user) return response.badRequest(res, authConstants.LOGIN_ERROR);

    const validation = validationPassword(dto.password, user.password);
    if (!validation) return response.badRequest(res, authConstants.LOGIN_ERROR);

    const data = this.authorization(user, res);
    response.ok(res, null, data);
  }

  @Converter('signin_admin')
  @Validator('common_email')
  @ErrorHandler()
  async signinAdmin(req: Request, res: Response) {
    const dto = req.body as SigninAdminAuthDto;

    const userFilters: Common.GetByFilters<User.Dto> = {
      filters: { email: dto.email },
      select: 'email name role password',
    };
    const user = await userService.findOneByFilters(userFilters);
    if (!user) return response.badRequest(res, authConstants.LOGIN_ADMIN_ERROR);
    if (user.role !== User.Role.ADMIN)
      return response.badRequest(res, authConstants.SIGNIN_ADMIN_ERROR);

    const validation = validationPassword(dto.password, user.password);
    if (!validation) return response.badRequest(res, authConstants.LOGIN_ADMIN_ERROR);

    const data = this.authorization(user, res);
    response.ok(res, null, data);
  }

  @Converter('send_code')
  @Validator('common_phone')
  @ErrorHandler()
  async sendCode(req: Request, res: Response) {
    const dto = req.body as SendCodeAuthDto;

    const exist = await userService.exists({ filters: { phone: dto.phone } });
    if (exist) return response.badRequest(res, userConstants.EXIST_PHONE);

    const code = generateCodes({ count: 1, length: 4, type: 'numberset' });
    const codeToken = createToken(
      { phone: dto.phone, code, referral: dto.referral || '' },
      Common.TokenType.CODE,
    );
    setCookieToken({ code: codeToken }, res);

    const isProd = process.env.NODE_ENV === 'production';
    if (isProd) {
      const message = await sms.sendSms({
        phone: dto.phone,
        text: smsConstants.SIGNUP(code as string),
      });
      if (!message) return response.badRequest(res, authConstants.SEND_CODE_ERROR);

      response.ok(res, authConstants.SENDED_PHONE);
    } else {
      response.ok(res, `Code: ${code}`);
    }
  }

  @ErrorHandler()
  async resendCode(_: Request, res: Response) {
    const code = res.locals.code;
    const recode = generateCodes({ count: 1, length: 4, type: 'numberset' });
    const codeToken = createToken(
      { phone: code.phone, code: recode, referral: code.referral || '' },
      Common.TokenType.CODE,
    );
    setCookieToken({ code: codeToken }, res);

    const isProd = process.env.NODE_ENV === 'production';
    if (isProd) {
      const message = await sms.sendSms({
        phone: code.phone,
        text: smsConstants.COMMON(recode as string),
      });
      if (!message) return response.badRequest(res, authConstants.SEND_CODE_ERROR);
      response.ok(res, authConstants.SENDED_PHONE);
    } else {
      response.ok(res, `Code: ${recode}`);
    }
  }

  @Converter('validate_code')
  @ErrorHandler()
  async validateCode(req: Request, res: Response) {
    const dto = req.body as ValidateCodeAuthDto;
    const code = res.locals.code;

    if (+code.code !== +dto.code)
      return response.badRequest(res, authConstants.INVALID_VALIDATE_CODE);

    const updatedToken = createToken(
      { phone: code.phone, code: code.code, referral: code.referral || '', verified: true },
      Common.TokenType.CODE,
    );

    setCookieToken({ code: updatedToken }, res);
    response.ok(res);
  }

  @Converter('signup')
  @Validator('common_password')
  @ErrorHandler()
  async singup(req: Request, res: Response) {
    const dto = req.body as SignupAuthDto;
    const code = res.locals.code;

    if (!code.verified) return response.badRequest(res, authConstants.CODE_UNVERIFIED);

    if (dto.name.length < 6 || dto.name.length > 150)
      return response.badRequest(res, userConstants.NAME_LENGTH);

    if (dto.password.length < 6 || dto.password.length > 30)
      return response.badRequest(res, userConstants.PASSWORD_LENGTH);

    const lastUser = await userService.findByFilters({
      filters: { role: { $ne: User.Role.ADMIN } },
      options: { sort: { _id: -1 }, limit: 1 },
      select: 'number'
    });

    const userCreate = {
      name: dto.name,
      phone: code.phone,
      password: userService.createPassword(dto.password),
      activated: false,
      number: (lastUser[0]?.number || 999) + 1,
    };
    const user = await userService.create(userCreate);
    await Promise.all([referralService.create(user._id), paymentService.create(user._id)]);

    const data = this.authorization(user, res);
    response.created(res, authConstants.SIGNUP_SUCCESS, data);

    if (code.referral) await referralService.addMember(code.referral, user._id);
    else if (Date.now() < 1_690_822_800_000) await referralService.addMemberByPatrion(user._id);
  }

  @Converter('recovery')
  @Validator('recovery')
  @ErrorHandler()
  async recovery(req: Request, res: Response) {
    const dto = req.body as RecoveryAuthDto;

    const userFilters: Common.GetByFilters<User.Dto> = {
      filters: { phone: dto.phone },
      select: 'phone',
      lean: true,
    };
    const user = await userService.findOneByFilters(userFilters);
    if (!user) return response.badRequest(res, userConstants.NOT_FOUND_PHONE);

    const code = generateCodes({ count: 1, length: 4, type: 'numberset' });
    const resetToken = createToken({ _id: user._id }, Common.TokenType.RESET);
    const codeToken = createToken({ phone: dto.phone, code }, Common.TokenType.CODE);

    setCookieToken({ reset: resetToken, code: codeToken }, res);

    const isProd = process.env.NODE_ENV === 'production';
    if (isProd) {
      const message = await sms.sendSms({
        phone: dto.phone,
        text: smsConstants.RECOVERY(code as string),
      });
      if (!message) return response.badRequest(res, authConstants.SEND_CODE_ERROR);

      response.ok(res, authConstants.SENDED_PHONE);
    } else {
      response.ok(res, `Code: ${code}`);
    }
  }

  @Converter('validate_code')
  @ErrorHandler()
  async recoveryCode(req: Request, res: Response) {
    const dto = req.body as RecoveryCodeAuthDto;

    const code = res.locals.code;
    const reset = res.locals.reset;

    if (+code.code !== +dto.code)
      return response.badRequest(res, authConstants.INVALID_VALIDATE_CODE);

    const userFilters: Common.GetByFilters<User.Dto> = { filters: { _id: reset._id } };
    const user = await userService.findOneByFilters(userFilters);
    if (!user) return response.notFound(res, userConstants.NOT_FOUND);

    const updatedToken = createToken(
      { _id: reset._id, code: code.code, verified: true },
      Common.TokenType.RESET,
    );

    setCookieToken({ reset: updatedToken }, res);
    response.ok(res);
  }

  @Converter('recovery_password')
  @Validator('common_password')
  @ErrorHandler()
  async recoveryPassword(req: Request, res: Response) {
    const dto = req.body as RecoveryPasswordAuthDto;
    const reset = res.locals.reset;

    if (!reset || !reset.verified)
      return response.badRequest(res, authConstants.VALIDATE_CODE_EXPIRED);

    const userFilters: Common.GetByFilters<User.Dto> = {
      filters: { _id: reset._id },
      select: 'password',
    };
    const user = await userService.findOneByFilters(userFilters);
    if (!user) return response.badRequest(res, userConstants.NOT_FOUND);

    if (dto.password !== dto.repeatPassword)
      return response.badRequest(res, userConstants.PASSWORD_NOT_MATCH);

    if (dto.password.length < 6 || dto.password.length > 30)
      return response.badRequest(res, userConstants.PASSWORD_LENGTH);

    const verifiedPassword = validationPassword(dto.password, user.password);
    if (verifiedPassword) return response.badRequest(res, authConstants.EXIST_PASSWORD);

    await userService.updateDoc({
      doc: user,
      update: {
        password: userService.createPassword(dto.password),
      },
    });

    removeCookieToken(['token', 'refresh', 'reset'], res);
    response.ok(res);
  }

  @Access()
  @ErrorHandler()
  async logout(_: Request, res: Response) {
    removeCookieToken(['token', 'refresh', 'reset'], res);
    response.ok(res);
  }

  authorization(user: User.Dto, res: Response) {
    const tokenData = { _id: user._id, role: user.role };
    const token = createToken(tokenData, Common.TokenType.ACCESS);
    const refresh = createToken(tokenData, Common.TokenType.REFRESH);

    setCookieToken({ refresh, token }, res);

    return {
      name: user.name,
      phone: user.phone,
      role: user.role,
    };
  }
}

export default new AuthController();
