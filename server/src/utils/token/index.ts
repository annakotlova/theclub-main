import crypto from 'crypto';
import { serialize } from 'cookie';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { Common } from '@/interfaces/common.dto';
import { Token } from './dto/token.dto';

import response from '../response';
import constants from '@/middlewares/constants';

const expires = {
  CODE: '15m',
  RESET: '10m',
  ACCESS: '5m',
  REFRESH: '3650d',
};

type VerifyJWTFunction = (
  token: string,
  secret: Common.TokenType,
  ignoreExpiration?: boolean,
) => JwtPayload | false;

export const verifyJWT: VerifyJWTFunction = (token, secret, ignoreExpiration = false) => {
  try {
    return jwt.verify(token, String(process.env['SECRET_' + secret]), {
      ignoreExpiration,
    }) as JwtPayload;
  } catch (err) {
    return false;
  }
};

export const createToken = (data: Record<string, any>, secret: Common.TokenType) => {
  return jwt.sign(data, String(process.env['SECRET_' + secret]), { expiresIn: expires[secret] });
};

export const sortHash = (data: Record<string, any>) => {
  return Object.entries(data)
    .sort()
    .reduce((acc: string, key) => acc + String(key.pop()), '');
};

export const createCryptoToken = (data: string, type: 'sha256') => {
  return crypto.createHash(type).update(data).digest('hex');
};

export const getSerialize = (name: string, token: string, action: 'set' | 'destroy') => {
  return serialize(name, token, {
    maxAge: action === 'set' ? 60 * 60 * 24 * 30 : -1,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    httpOnly: true,
    path: '/',
  });
};

export const setCookieToken: Token.Generate = (tokens, res) => {
  const keys = Object.keys(tokens);
  const cookie = keys.reduce((acc: Array<string>, key) => {
    return acc.concat(getSerialize(key, tokens[key] as string, 'set'));
  }, []);

  res.setHeader('Set-Cookie', cookie);
};

export const removeCookieToken: Token.Remove = (tokens, res) => {
  const cookie = tokens.reduce((acc: Array<string>, key) => {
    return acc.concat(getSerialize(key, 'null', 'set'));
  }, []);
  res.setHeader('Set-Cookie', cookie);
};

export const verifyAnyToken =
  (type: Common.TokenType, where = 'token', ignore = false, message?: string): Common.ExpressFunction =>
  (req, res, next) => {
    const token = req.cookies[where];
    if (!token) return response.unauthorized(res);

    const jwtToken = verifyJWT(token, type, ignore);
    if (!jwtToken) return response.unauthorized(res, message || constants.TOKEN_LIFETIME);

    res.locals[type.toLowerCase()] = jwtToken;
    next();
  };
