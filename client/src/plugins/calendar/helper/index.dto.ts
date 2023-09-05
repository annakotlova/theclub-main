export interface CalendarOptions {
  id: string;
  show: {
    time: boolean;
    date: boolean;
  };
}

export interface Calendar {
  options: CalendarOptions;
  date: Date;
}
