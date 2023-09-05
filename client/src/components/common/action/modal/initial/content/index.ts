import { ModalInitial, ModalContent } from '@/interfaces/modal/modal.dto';

import { subscription } from './subscription';
import { payment } from './payment';
import { review } from './review';
import { event } from './event';
import { user } from './user';

export const initialContent = ({ id, data }: ModalInitial): ModalContent => {
  const contents = [...subscription, ...payment, ...user, ...event, ...review] as ModalContent[];
  return contents.find((content) => content.id === id) || contents[0];
};
