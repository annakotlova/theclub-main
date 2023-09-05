import { StructureInput, StructureModule } from '@/interfaces/common/structure.dto';
import { objectCollection } from '..';

const inputs = (): Array<StructureInput> => [
  {
    id: 'amount',
    name: 'Сумма вывода, ₽',
    placeholder: 'Введите сумму вывода',
    grid: '1 / 13',
    mask: '######',
    type: 'text',
    required: true,
  },
];

export const payment = (data: Record<string, any>): Array<StructureModule> => {
  return [
    {
      id: 'payment-withdrawal',
      data: objectCollection(data, ['amount']),
      inputs: inputs(),
    },
  ];
};
