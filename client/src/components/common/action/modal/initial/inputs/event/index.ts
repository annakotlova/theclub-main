import { StructureModule } from '@/interfaces/common/structure.dto';
import { objectCollection } from '..';

export const event = (data: Record<string, any>): Array<StructureModule> => {
  return [
    {
      id: 'event-create',
      data: objectCollection(data, [
        'cover',
        'name',
        'content',
        'startedAt',
        'place',
        'link',
        'period',
        'minMembers',
        'maxMembers',
        'subject',
        'category',
        'format',
      ]),
      inputs: [],
    },
    {
      id: 'event-support',
      data: objectCollection(data, ['_id', 'name', 'list', 'selected']),
      inputs: [
        {
          grid: '1 / 13',
          id: 'supports',
          type: 'userlist-multiple',
          name: '',
          placeholder: '',
          show: true,
          required: true,
        },
      ],
    },
    {
      id: 'event-qrcode',
      data: objectCollection(data, ['name', 'qrcode', 'startedAt']),
      inputs: [
        {
          grid: '1 / 13',
          id: 'qrcode',
          type: 'qrcode',
          name: '',
          placeholder: '',
          show: true,
          required: true,
        },
      ],
    },
    {
      id: 'event-cancel',
      data: objectCollection(data, ['_id', 'name']),
      inputs: [],
    },
    {
      id: 'event-delete',
      data: objectCollection(data, ['_id', 'name']),
      inputs: [],
    },
  ];
};
