import { CommonFilter, TimestampDto } from '../common/index.dto';
import { UserDto, UserSubject } from '../user/user.dto';
import { FileDto } from '../file/file.dto';

export interface EventDto extends TimestampDto {
  name: string;
  content: string;
  additional: string;
  place: string;
  link: string;

  creator: UserDto;
  cover: FileDto;

  format: EventFormat;
  category: EventCategory;
  subject: UserSubject;
  organizer: EventOrganizer;
  status: EventStatus;

  startedAt: Date;
  endedAt: Date;

  minMembers: number;
  maxMembers: number;
  members: Array<UserDto>;
  waiting: Array<UserDto>;
  supports: Array<{ approved: boolean; member: UserDto }>;

  // Lean
  isMember: boolean;
  isWaiting: boolean;
  qrcode: string;
  period: string;
}

export interface EventFilters {
  category: EventCategory | CommonFilter;
  subject: UserSubject | CommonFilter;
  organizer: EventOrganizer | CommonFilter;
}

export enum EventSort {
  NEAREST = 'NEAREST',
  NOVELTY = 'NOVELTY',
  POPULAR = 'POPULAR',
}

export enum EventOrganizer {
  CLUB = 'CLUB',
  MEMBERS = 'MEMBERS',
}

export enum EventFormat {
  MASTERMIND = 'MASTERMIND',
  WEBINAR = 'WEBINAR',
  TRAINING = 'TRAINING',
  WORKSHOP = 'WORKSHOP',
  COMMUNICATION = 'COMMUNICATION',
  OTHER = 'OTHER',
}

export enum EventCategory {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export enum EventStatus {
  CREATED = 'CREATED',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
  CANCELED = 'CANCELED',
  BLOCKED = 'BLOCKED',
}

// Names
export enum EventSortName {
  NEAREST = 'ближайшему',
  NOVELTY = 'новизне',
  POPULAR = 'популярности',
}

export enum EventCategoryName {
  ONLINE = 'Онлайн',
  OFFLINE = 'Оффлайн',
}

export enum EventFormatName {
  MASTERMIND = 'Мастер-майнд',
  WEBINAR = 'Вебинар',
  TRAINING = 'Тренинг',
  WORKSHOP = 'Практикум',
  COMMUNICATION = 'Свободное общение',
  OTHER = 'Другое',
}

export enum EventOrganizerName {
  CLUB = 'Клуб',
  MEMBERS = 'Участники',
}

export enum EventStatusName {
  CREATED = 'Создано',
  IN_PROGRESS = 'В процессе',
  FINISHED = 'Завершено',
  CANCELED = 'Отменено',
  BLOCKED = 'Заблокировано',
}

// Drops
export const EventSortDrop = [
  { _id: EventSort.NEAREST, name: EventSortName.NEAREST },
  { _id: EventSort.NOVELTY, name: EventSortName.NOVELTY },
  { _id: EventSort.POPULAR, name: EventSortName.POPULAR },
];

export const EventFormatDrop = [
  { _id: EventFormat.MASTERMIND, name: EventFormatName.MASTERMIND },
  { _id: EventFormat.WEBINAR, name: EventFormatName.WEBINAR },
  { _id: EventFormat.TRAINING, name: EventFormatName.TRAINING },
  { _id: EventFormat.WORKSHOP, name: EventFormatName.WORKSHOP },
  { _id: EventFormat.COMMUNICATION, name: EventFormatName.COMMUNICATION },
  { _id: EventFormat.OTHER, name: EventFormatName.OTHER },
];

export const EventCategoryDrop = [
  { _id: EventCategory.ONLINE, name: EventCategoryName.ONLINE },
  { _id: EventCategory.OFFLINE, name: EventCategoryName.OFFLINE },
];

export const EventCategoryFilterDrop = [{ _id: 'ALL', name: 'Любой' }, ...EventCategoryDrop];

export const EventOrganizerDrop = [
  { _id: 'ALL', name: 'Любой' },
  { _id: EventOrganizer.CLUB, name: EventOrganizerName.CLUB },
  { _id: EventOrganizer.MEMBERS, name: EventOrganizerName.MEMBERS },
];
