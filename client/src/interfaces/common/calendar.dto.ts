export type CalendarMode = 'dates' | 'months' | 'years';

export interface CalendarOptions {
  id: string;
  time: boolean;
}

export interface Calendar {
  options: CalendarOptions;
}
