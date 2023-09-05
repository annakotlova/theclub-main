import { ModalContent } from '@/interfaces/modal/modal.dto';

export const review: Array<ModalContent> = [
  {
    id: 'review-create',
    title: 'Оставьте отзыв!',
    action: 'create',
    request: '/review',
    method: 'post',
    submitName: 'Оставить отзыв',
    emit: 'review-action',
  },
];
