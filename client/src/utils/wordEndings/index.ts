export const endings = {
  second: ['секунд', 'секунду', 'секунды'],
  minute: ['минут', 'минуту', 'минуты'],
  hour: ['часов', 'час', 'часа'],
  day: ['дней', 'день', 'дня'],
  month: ['месяцев', 'месяц', 'месяца'],
  year: ['лет', 'год', 'года'],
  people: ['человек', 'человек', 'человека'],
};

/**
 * Получить корректное окончания слова определенного типа
 * @param number Количество элементов для корректного определения окончания
 * @param type Определенный тип для слова
 * @returns Слово с корректным окончанием
 */
export const wordEndings = (number: number, type: keyof typeof endings) => {
  return getDescription(number, endings[type]);
};

function getDescription(value: number, desc: Array<string>) {
  if (value <= 10 || value >= 20) {
    if (value % 10 === 1) return desc[1];
    else if (value % 10 >= 2 && value % 10 <= 4) return desc[2];
  }
  return desc[0];
}
