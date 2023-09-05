import { User } from './user.dto';

export type ChangeEmailUserDto = Pick<User.Dto, 'email'>;