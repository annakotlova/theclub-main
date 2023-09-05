import zeroFilter from '@/filters/zero.filter';
import { CalendarMode } from '@/interfaces/common/calendar.dto';

export const MonthNames = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
];

export const MonthNamesCir = [
  'Янв',
  'Фев',
  'Мар',
  'Апр',
  'Май',
  'Июн',
  'Июл',
  'Авг',
  'Сен',
  'Окт',
  'Ноя',
  'Дек',
];

export function getDateNullTime(date: Date, type = 'date', option?: 'betweenTime') {
  const d = new Date(date);
  const day = type === 'date' ? zeroFilter(d.getDate()) : '01';
  const month = type === 'year' ? '01' : zeroFilter(d.getMonth() + 1);

  if (option === 'betweenTime') return `${d.getFullYear()}-${month}-${day}`;
  return new Date(`${d.getFullYear()}-${month}-${day}T00:00`);
}

export const differenceTime = (first: Date, second: Date) =>
  (new Date(first).getTime() - second.getTime()) / (1000 * 3600 * 24);

export const switchMonth = (month: Date, inc: number, type: CalendarMode) => {
  if (type === 'dates') month.setMonth(month.getMonth() + inc, 1);
  if (type === 'months') month.setFullYear(month.getFullYear() + inc);
  if (type === 'years') month.setFullYear(month.getFullYear() + inc * 10);
  return new Date(Number(month));
};

export const dayWeekList = () => {
  return ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
};

export const aroundDates = (date: Date) => {
  return getWeeks(date, true);
};

export const getMonthDates = (date: Date) => {
  const firstDate = firstMonthDate(date);
  let array: Array<Date> = [];

  const lastDate = lastMonthDate(date);
  for (let i = 0; i < lastDate.getDate(); i++) {
    array = [...array, new Date(firstDate.setDate(firstDate.getDate() + (!i ? 0 : 1)))];
  }
  return array;
};

export const getWeeks = (date: Date, around = false) => {
  let array: Array<any> = [];
  let firstDate = firstMonthDate(date);
  const firstLength = firstDate.getDay() || 7;

  for (let i = 1; i < firstLength; i++) {
    array = [
      { value: new Date(firstDate.setDate(firstDate.getDate() + -1)), type: 'prev' },
      ...array,
    ];
  }
  firstDate = firstMonthDate(date);
  const lastDate = lastMonthDate(date);
  for (let i = 0; i < lastDate.getDate(); i++) {
    array = [
      ...array,
      { value: new Date(firstDate.setDate(firstDate.getDate() + (!i ? 0 : 1))), type: 'current' },
    ];
  }
  const length = array.length;
  const max = length > 35 ? 42 : 35;

  for (let i = 0; i < max - length; i++) {
    array = [
      ...array,
      { value: new Date(firstDate.setDate(firstDate.getDate() + 1)), type: 'next' },
    ];
  }
  if (around)
    return { startedAt: array.shift()?.value as Date, endedAt: array.pop()?.value as Date };
  return divisorWeek(array);
};

export function divisorWeek(array: Array<any>) {
  const result: Array<Array<any>> = [[], [], [], [], []];
  let week = 0;
  for (let i = 1; i <= array.length; i++) {
    if (!result[week]) result[week] = [];
    result[week] = [...result[week], array[i - 1]];
    if (i % 7 === 0) week += 1;
  }
  return result;
}

export const getMonthList = (date: Date) => {
  const first = new Date(`${date.getFullYear() - 1}-12-01T00:00`);
  let months = [] as Array<Date>;
  for (let i = 0; i < 12; i++) {
    months = [...months, new Date(first.setMonth(first.getMonth() + 1, 1))];
  }
  return months;
};

export const getYearList = (date: Date) => {
  const first = new Date(`${Math.floor(date.getFullYear() / 10) * 10 - 1}-01-01T00:00`);
  let years = [] as Array<Date>;
  for (let i = 0; i < 10; i++) {
    years = [...years, new Date(first.setFullYear(first.getFullYear() + 1))];
  }
  return years;
};

export const lastMonthDate = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};
export const firstMonthDate = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth());
};
