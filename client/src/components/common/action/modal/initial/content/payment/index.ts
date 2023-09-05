import { ModalContent } from '@/interfaces/modal/modal.dto';

export const payment: Array<ModalContent> = [
  {
    id: 'payment-withdrawal',
    title: 'Вывод средств',
    action: 'edit',
    request: '/payment/withdrawal',
    method: 'post',
    submitName: 'Вывести',
    emit: 'payment-action',
  },
];
