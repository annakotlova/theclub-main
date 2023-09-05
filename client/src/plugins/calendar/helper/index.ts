import zeroFilter from '@/filters/zero.filter';

export type DateValue = { value: Date; type: string };

export function getDateNullTime(date: Date) {
  const d = new Date(date);
  const day = zeroFilter(d.getDate());
  const month = zeroFilter(d.getMonth() + 1);

  return new Date(`${d.getFullYear()}-${month}-${day}T00:00`);
}

export const differenceTime = (first: Date, second: Date) =>
  (new Date(first).getTime() - second.getTime()) / (1000 * 3600 * 24);

export const switchMonth = (month: Date, inc: number) => {
  month.setMonth(month.getMonth() + inc);
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
  let array: Array<DateValue> = [];
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

export function divisorWeek(array: Array<DateValue>) {
  const result: Array<Array<DateValue>> = [[], [], [], [], []];
  let week = 0;
  for (let i = 1; i <= array.length; i++) {
    if (!result[week]) result[week] = [];
    result[week] = [...(result[week] as Array<DateValue>), array[i - 1] as DateValue];
    if (i % 7 === 0) week += 1;
  }
  return result;
}

export const getMonthList = (date: Date) => {
  const first = new Date(`${date.getFullYear() - 1}-12-01T00:00`);
  let months = [] as Array<Date>;
  for (let i = 0; i < 12; i++) {
    months = [...months, new Date(first.setMonth(first.getMonth() + 1))];
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
