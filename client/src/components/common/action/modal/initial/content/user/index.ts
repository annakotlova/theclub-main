import { ModalContent } from '@/interfaces/modal/modal.dto';

export const user: Array<ModalContent> = [
  {
    id: 'user-update',
    title: 'Редактирование профиля',
    action: 'edit',
    request: '/user',
    method: 'patch',
    submitName: 'Сохранить',
    emit: 'user-action',
  },
  {
    id: 'user-phone',
    title: 'Смена номера телефона',
    action: 'edit',
    request: '/user/phone/validate',
    method: 'patch',
    submitName: 'Изменить',
    emit: 'user-action',
  },
  {
    id: 'user-password',
    title: 'Смена пароля',
    action: 'edit',
    request: '/user/password',
    method: 'patch',
    submitName: 'Изменить',
    emit: 'user-action',
  },
];
