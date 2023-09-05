import { ModalContent } from '@/interfaces/modal/modal.dto';

export const subscription: Array<ModalContent> = [
  {
    id: 'subscription-cancel',
    title: 'Отменить подписку',
    action: 'edit',
    request: '/payment/cancel',
    method: 'patch',
    submitName: 'Отменить',
    message: 'Вы действительно хотите отменить подписку?',
    emit: 'payment-action',
  },
  {
    id: 'subscription-extend',
    title: 'Продление подписки',
    action: 'static',
  },
];
