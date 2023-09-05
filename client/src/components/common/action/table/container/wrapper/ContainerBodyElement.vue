<script setup lang="ts">
import dateFilter from '@/filters/date.filter';
import spaceFilter from '@/filters/space.filter';

import { manipulation } from '@/utils/input';
import { TransactionStatus, TransactionStatusName } from '@/interfaces/transaction/transaction.dto';

const props = defineProps<{
  variable: string;
  width: string;
  element: Record<string, any>;
  table: string;
  index: number;
}>();

const currentClass = () => {
  if (props.table === 'transaction' && props.variable === 'amount') return { green: true };
  return '';
};

const manipulationText = () => {
  manipulation.setString = currentText();
  return manipulation.getSafeHTML;
};

const currentText = () => {
  const object = props.element;
  const text = object[props.variable];

  if (['price', 'amount', 'count'].includes(props.variable)) return text ? spaceFilter(text) : '--';
  if (props.variable.includes('At')) return text ? dateFilter(new Date(text), 'datetime') : '--';

  if (props.variable === 'status' && props.table === 'transaction')
    return TransactionStatusName[text as TransactionStatus];

  return text || '--';
};
</script>

<template>
  <div class="table--body-td" :style="`min-width: ${width}; max-width: ${width}`">
    <div
      class="flex-column text text-1 fz14"
      :class="currentClass()"
      v-html="manipulationText()"
    ></div>
  </div>
</template>

<style scoped lang="scss">
.table--body-td {
  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }
  > div {
    line-height: 18px;
    gap: 8px;
    &:deep() {
      .green,
      .red {
        font-weight: 500;
      }
      .red {
        color: var(--red_color);
      }
      .pink {
        color: var(--pink_color);
      }
      .green {
        color: var(--green_color);
      }
    }
  }
}
</style>
