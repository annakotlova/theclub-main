import { User } from '@/modules/user/dto/user.dto';

declare global {
  namespace Express {
    interface Locals {
      user: { _id: string; role?: User.Role };
      reset: { _id: string; code: string; verified?: boolean };
      code: { phone: string; code: string; verified?: boolean, referral?: string };
    }
  }
}

export {};
