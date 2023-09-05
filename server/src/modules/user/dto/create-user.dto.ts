import { User } from './user.dto';

export type CreateUserDto = Pick<User.Dto, 'name' | 'phone' | 'password' | 'activated' | 'number'> & { role?: User.Role };
