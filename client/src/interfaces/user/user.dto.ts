import { TimestampDto } from '../common/index.dto';
import { FileDto } from '../file/file.dto';

export interface UserDto extends TimestampDto {
  name: string;
  about: string;
  login: string;
  phone: string;
  password: string;
  role: UserRole;
  subjects: Array<UserSubjectCommon>;
  birthday: string;

  verified: boolean;
  activated: boolean;

  balance: number;
  balanceHash: string;

  avatar: FileDto;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  PATRION = 'PATRION',
  USER = 'USER',
}

export enum UserSubject {
  SPIRIT = 'SPIRIT',
  BODY = 'BODY',
  MIND = 'MIND',
  OTHER = 'OTHER',
}

export enum UserSubjectCommon {
  SPIRIT = 'SPIRIT',
  BODY = 'BODY',
  MIND = 'MIND',
}

export enum UserSubjectName {
  SPIRIT = 'Дух',
  BODY = 'Тело',
  MIND = 'Разум',
  OTHER = 'Другое',
}

export const UserSubjectDrop = [
  { _id: UserSubject.SPIRIT, name: UserSubjectName.SPIRIT },
  { _id: UserSubject.BODY, name: UserSubjectName.BODY },
  { _id: UserSubject.MIND, name: UserSubjectName.MIND },
  { _id: UserSubject.OTHER, name: UserSubjectName.OTHER },
];

export const UserSubjectFilterDrop = [{ _id: 'ALL', name: 'Любой' }, ...UserSubjectDrop];
