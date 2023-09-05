import { convertes } from './constants';

import { Convert } from './dto/convert.dto';

import response from '@/utils/response';

const trimElement: Convert.TrimElementFunction = (object, trim) => {
  const selector = trim.split(' ');
  for (const key of selector)
    if (object[key]) object[key] = String(object[key]).trim().toLowerCase();
};

const checkEnumKey: Convert.CheckEnumKeyFunction = (body, result, key, errors) => {
  const value = body[key.id] as string | string[];
  const isArray = Array.isArray(value);
  const startErrorLength = errors.length;
  const enumList = Object.values(key.enum).join(', ');

  if (!isArray && !key.enum[value])
    errors.push(`Поле "${key.name}" должно иметь одно из значений: ${enumList}`);

  if (isArray)
    for (const el of value)
      if (!key.enum[el]) {
        errors.push(`Поле "${key.name}" должно иметь несколько из значений: ${enumList}`);
        break;
      }
  if (errors.length !== startErrorLength) result[key.id] = value;
  return;
};

export const objectCheck: Convert.ObjectCheckFunction = (body, keys) => {
  const errors = [] as string[];
  const result = {} as Record<string, any>;
  if (body._id) result['_id'] = body._id;

  for (const key of keys) {
    let value = body[key.id];

    if ((key.required || value !== undefined) && key.type === 'number') value = Number(value);
    if (key.required && key.type === 'boolean' && value) value = !!value;

    if (key.enum && value)
      checkEnumKey(body as Record<string, string | string[]>, result, key, errors);
    else if (key.required || !!value || value != null) {
      if (!value && value !== 0 && value !== false && key.required)
        errors.push(`Поле "${key.name}" обязательно для заполнения!`);
      else if (
        (key.type === 'boolean' && value == null) ||
        (key.type === 'string' && typeof value !== 'string') ||
        (key.type === 'array' && !Array.isArray(value)) ||
        (key.type === 'number' && value && isNaN(+value))
      )
        errors.push(`Поле "${key.name}" должно иметь тип ${key.type}!`);
    }
    if (value !== undefined) result[key.id] = value;
  }

  if (!!errors.length) return { status: false, body: errors.join('\n') };
  return { status: true, body: result };
};

export const convertBody: Convert.ConvertBodyFunction = (options) => {
  const result = objectCheck(options.object, convertes[options.type].list as Convert.Body);
  if (options.trim && result.status) trimElement(options.object, options.trim);
  return result;
};

export const Converter = (type: keyof typeof convertes) => {
  return (
    target: Object,
    _: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>,
  ) => {
    const method = descriptor.value;
    descriptor.value = async (req, res, next) => {
      const object_type = convertes[type].type as 'body' | 'query' | 'params';

      const convert = convertBody({ type, object: req[object_type] });
      if (!convert.status) return response.badRequest(res, convert.body as string);

      req[object_type] = convert.body;

      return await method?.apply(target, [req, res, next]);
    };
  };
};
