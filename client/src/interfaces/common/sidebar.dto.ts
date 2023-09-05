export interface SidebarDto {
  name: string;
  description: string;
}

export const SidebarList = {
  EventList: { name: 'Меро приятия', description: 'тыкай справа и не упусти ничего интересного' },
  'event-list_mobile': { name: 'Меро прия тия', description: 'чекай ниже и не упусти ничего интересного' },
  Profile: {
    name: 'мой профиль',
    description:
      'Справа ты найдешь Себя, свою основную команду и календарь событий. Ознакомься, чтобы потом не втыкать.',
  },
  profile_mobile: {
    name: 'мой профиль',
    description:
      'Снизу ты найдешь Себя, свою основную команду и календарь событий. Ознакомься, чтобы потом не втыкать.',
  },
};
