import { MathCeil10 } from '../common/math';
import { MONTH_NAMES_CIR } from '../date/enums';

const generateMonthList = (startedAt: Date, endedAt: Date) => {
  let dates = [] as Array<{ date: string, quantity: number }>;
  let start = new Date(startedAt);

  while (Number(start) <= Number(endedAt)) {
    dates = [...dates, { date: String(MONTH_NAMES_CIR[new Date(start).getMonth()]), quantity: 0 }];
    start = new Date(start.setMonth(start.getMonth() + 1));
  }
  return dates;
}

export const preparingMonthDates = (array: Array<Record<string, any>>, property = 'createdAt') => {
  for (const object of array) object.date = MONTH_NAMES_CIR[new Date(object[property]).getMonth()];
};

export const uniqueMonthObject = (array: Array<Record<string, any>>, startedAt: Date, endedAt: Date, property?: string) => {
  let dates = generateMonthList(startedAt, endedAt);
  for (const object of array) {
    const quantity = property ? object[property] : 1;
    
    const date = dates.find(e => e.date === object.date);
    if (!date) dates = [...dates, { date: object.date, quantity: quantity }];
    else date.quantity = MathCeil10(date.quantity + quantity, -2);
  }
  return dates;
}