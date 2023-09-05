import { endings, wordEndings } from '@/utils/wordEndings';
import dateFilter from './date.filter';

const gaps = [
  { desc: 'second', min: 1 * 1000, max: 60 * 1000 },
  { desc: 'minute', min: 60 * 1000, max: 3600 * 1000 },
  { desc: 'hour', min: 3600 * 1000, max: 86400 * 1000 },
] as Array<{ desc: keyof typeof endings; min: number; max: number }>;

export default (date: Date) => {
  const difference = Date.now() - Number(new Date(date));
  if (difference < 1000) return `1 секунду назад`;

  const gap = gaps.find((g) => g.min <= difference && g.max > difference);
  if (!gap) return dateFilter(date, 'datetime');

  const number = Math.floor(difference / gap.min);
  const result = `${number} ${wordEndings(number, gap.desc)} назад`;

  return result;
};
