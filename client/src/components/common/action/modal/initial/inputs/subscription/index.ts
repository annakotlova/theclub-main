import { StructureInput, StructureModule } from '@/interfaces/common/structure.dto';
import { objectCollection } from '..';

const inputsExtend = (): Array<StructureInput> => [
  {
    grid: '1 / 13',
    id: 'type',
    type: 'subscription-extend',
    name: '',
    placeholder: '',
    show: true,
    required: true,
  },
];

export const subscription = (data: Record<string, any>): Array<StructureModule> => {
  return [
    {
      id: 'subscription-cancel',
      data: objectCollection(data, ['_id', 'name']),
      inputs: [],
    },
    {
      id: 'subscription-extend',
      data: objectCollection(data, []),
      inputs: inputsExtend(),
    },
  ];
};
