import { validator_types, validators } from './constants';

import { IValidator } from './dto/validator.dto';

import response from '@/utils/response';

export const validator: IValidator.MainFunction = (list) => {
  const errors = [] as string[];
  for (const item of list) {
    if (!item.item && item.item !== '') continue;
    const check = validator_types[item.type];
    if (!check.check(item.item)) errors.push(check.message);
  }
  return { status: !errors.length, errors: errors.join('\n') };
};

export const Validator = (type: keyof typeof validators) => {
  return (
    target: Object,
    _: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>,
  ) => {
    const method = descriptor.value;
    descriptor.value = async (req, res, next) => {
      const validator_object = req[validators[type].type as 'body' | 'query' | 'params'];
      const list = validators[type].list as any;
      const validator_list = Object.keys(list).map((key) => ({
        item: validator_object[key],
        type: list[key],
      }));

      const valid = validator(validator_list);
      if (!valid.status) return response.badRequest(res, valid.errors);

      return await method?.apply(target, [req, res, next]);
    };
  };
};
