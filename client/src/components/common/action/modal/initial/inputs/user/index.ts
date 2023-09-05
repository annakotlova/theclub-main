import { defineAsyncComponent, markRaw } from 'vue';
import { StructureInput, StructureModule } from '@/interfaces/common/structure.dto';
import { objectCollection } from '..';

const IconCommonCalendar = defineAsyncComponent(() => import('@icons/common/calendar.vue'));

const inputsUpdate = (): Array<StructureInput> => [
  {
    grid: '1 / 13',
    id: 'name',
    type: 'text',
    name: 'ФИО',
    placeholder: 'Введите ФИО',
    show: true,
    required: true,
  },
  {
    grid: '1 / 13',
    id: 'birthday',
    type: 'date',
    name: 'Дата рождения',
    mask: '##.##.####',
    placeholder: 'дд.мм.гггг',
    show: true,
    required: false,
    icon: markRaw(IconCommonCalendar),
  },
  {
    grid: '1 / 13',
    id: 'about',
    type: 'textarea',
    name: 'Описание профиля',
    placeholder: 'Введите описание',
    show: true,
    required: false,
  },
];

const inputsPhone = (): Array<StructureInput> => [
  {
    grid: '1 / 13',
    id: 'phone',
    type: 'text',
    name: 'Номер телефона',
    placeholder: '+7(999)999-99-99',
    mask: '+7(###)###-##-##',
    show: true,
    required: true,
  },
  {
    grid: '1 / 13',
    id: 'code',
    type: 'code',
    name: '',
    placeholder: '',
    show: true,
    required: false,
  },
];

const inputsPassword = (): Array<StructureInput> => [
  {
    grid: '1 / 13',
    id: 'password',
    type: 'password',
    name: 'Новый пароль',
    placeholder: 'Введите пароль',
    show: true,
    required: true,
  },
  {
    grid: '1 / 13',
    id: 'repeatPassword',
    type: 'password',
    name: 'Подтвердите пароль',
    placeholder: 'Введите пароль',
    show: true,
    required: false,
  },
  {
    grid: '1 / 13',
    id: 'oldPassword',
    type: 'password',
    name: 'Текущий пароль',
    placeholder: 'Введите пароль',
    show: true,
    required: false,
  },
];

export const user = (data: Record<string, any>): Array<StructureModule> => {
  return [
    {
      id: 'user-update',
      data: objectCollection(data, ['name', 'about', 'birthday']),
      inputs: inputsUpdate(),
    },
    {
      id: 'user-phone',
      data: objectCollection(data, ['phone', 'code']),
      inputs: inputsPhone(),
    },
    {
      id: 'user-password',
      data: objectCollection(data, ['password', 'repeatPassword', 'oldPassword']),
      inputs: inputsPassword(),
    },
  ];
};
