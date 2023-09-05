import { MONTH_NAMES_CIR } from './enums';
import zero from './zero.filter';

export default (value: Date | string | number, filter: string = 'date') => {
  const date = new Date(value);
  const result = [];

  const day = zero(date.getDate());
  const month = filter.includes('MonthName')
    ? MONTH_NAMES_CIR[date.getMonth()]
    : zero(date.getMonth() + 1);
  const year = date.getFullYear();
  const minute = zero(date.getHours());
  const second = zero(date.getMinutes());

  if (filter.includes('date'))
    result.push(filter.includes('MonthName') ? `${day} ${month}` : `${day}.${month}.${year}`);
  if (filter.includes('time')) result.push(`${minute}:${second}`);

  return result.join(' ');
};

export const differenceTime = (first: Date, second: Date) =>
  (new Date(first).getTime() - new Date(second).getTime()) / (1000 * 3600 * 24);

export const getYearList = () => {
  const start = '2022';
  const current = new Date();
  let list = [] as string[];
  while (current.getFullYear() <= Number(start)) {
    list = [...list, String(current.getFullYear())];
    current.setFullYear(current.getFullYear() + 1);
  }
  return list;
};
