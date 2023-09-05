import zero from './zero.filter';

export default (value: Date | string | number | null, filter = 'date'): string => {
  if (!value) return '';

  const currentYear = new Date().getFullYear();
  const date = new Date(value);
  const result = [];

  const day = zero(date.getDate());
  const month = zero(date.getMonth() + 1);
  const year = date.getFullYear();

  const minute = zero(date.getHours());
  const second = zero(date.getMinutes());

  if (filter.includes('date')) result.push(`${day}.${month}`);
  if (filter.includes('year')) result[0] += `.${year}`;
  else if (filter.includes('date') && currentYear !== year) result[0] += `.${year}`;
  if (filter.includes('time')) result.push(`${minute}:${second}`);
  return result.join(' | ');
};
