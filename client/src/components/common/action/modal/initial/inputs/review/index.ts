import { StructureModule } from '@/interfaces/common/structure.dto';
import { objectCollection } from '..';

export const review = (data: Record<string, any>): Array<StructureModule> => {
  return [
    {
      id: 'review-create',
      data: objectCollection(data, ['event', 'rating', 'description']),
      inputs: [
        {
          grid: '1 / 13',
          id: 'rating',
          type: 'rating',
          name: '',
          placeholder: '',
          show: true,
          required: true,
        },
        {
          grid: '1 / 13',
          id: 'description',
          type: 'textarea',
          name: 'Описание',
          placeholder: 'Введите текст...',
          show: true,
          required: true,
        },
      ],
    },
  ];
};
