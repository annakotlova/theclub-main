import { StructureModule } from '@/interfaces/common/structure.dto';
import { ModalInitial } from '@/interfaces/modal/modal.dto';
import { subscription } from './subscription';
import { payment } from './payment';
import { review } from './review';
import { event } from './event';
import { user } from './user';

const untouchableVariables = ['cover'];

export const objectCollection = (data: Record<string, any>, properties: Array<string>) => {
  return properties.reduce((acc: Record<string, any>, property: string) => {
    if (
      data[property] &&
      Object.hasOwn(data[property], '_id') &&
      !untouchableVariables.includes(property)
    ) {
      acc[property] = data[property]._id;
    } else {
      const falsy = data[property] != null ? data[property] : '';
      acc[property] = falsy;
    }
    return acc;
  }, {});
};

export const initialInputs = ({ id, data }: ModalInitial): StructureModule | null => {
  const inputs = [
    { id: 'subscription', inputs: subscription },
    { id: 'payment', inputs: payment },
    { id: 'review', inputs: review },
    { id: 'event', inputs: event },
    { id: 'user', inputs: user },
  ] as {
    id: string;
    inputs: (data: any) => StructureModule[];
  }[];

  const current = inputs.find((input) => id.includes(input.id));
  if (!current) return null;

  return current.inputs(data).find((input) => input.id === id) || null;
};
