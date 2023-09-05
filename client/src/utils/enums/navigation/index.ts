import { markRaw } from 'vue';
import { Navigation } from '@/interfaces/common/navigation.dto';

import IconMenuEvent from '@icons/menu/event.vue';
import IconMenuProfile from '@icons/menu/user.vue';
import IconMenuLogout from '@icons/menu/logout.vue';
import IconMenuHome from '@icons/menu/home.vue';

export const MAIN = [
  {
    id: 'home',
    name: 'Главная',
    path: 'Start',
    icon: markRaw(IconMenuHome),
  },
  {
    id: 'event-list',
    name: 'Мероприятия',
    path: 'EventList',
    icon: markRaw(IconMenuEvent),
  },
  {
    id: 'profile',
    name: 'Профиль',
    path: 'Profile',
    icon: markRaw(IconMenuProfile),
  },
];

export const ADDITIONAL = [
  {
    id: 'logout',
    name: 'Выйти',
    path: 'Start',
    icon: markRaw(IconMenuLogout),
  },
];

const navigations = {
  main: MAIN,
  additional: ADDITIONAL,
};

export const getNavigation = (navigation: keyof typeof navigations): Array<Navigation> => {
  return navigations[navigation];
};
