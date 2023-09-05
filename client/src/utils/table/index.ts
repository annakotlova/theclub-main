import { TableOptions } from '@/interfaces/table/table.dto';

export const TransactionTable = {
  id: 'transaction',
  name: '',
  width: '100%',
  min_width: '100px',
  request: '/transaction/list?type=',
  empty: 'У вас пока еще нет ни одной операции',
  elements: [
    { id: 'createdAt', name: 'Дата вывода', width: '30%' },
    { id: 'amount', name: 'Сумма', width: '25%' },
    { id: 'status', name: 'Статус', width: '25%' },
    { id: 'pan', name: 'Карта', width: '20%' },
  ],
} as TableOptions;
