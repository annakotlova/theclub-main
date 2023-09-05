import bcrypt from 'bcryptjs';

export const createPassword = (password: string) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validationPassword = (password: string, currentPassword: string) =>
  bcrypt.compareSync(password, currentPassword);