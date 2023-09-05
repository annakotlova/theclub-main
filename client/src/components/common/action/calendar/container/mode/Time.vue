<script setup lang="ts">
import { mask as vMask } from 'vue-the-mask';
import zeroFilter from '@/filters/zero.filter';

const emit = defineEmits<{
  (e: 'selectTime', date: Date): void;
}>();

const { startedAt } = defineProps<{
  startedAt?: Date | string;
}>();

const timeHandler = (value: string) => {
  const time = value.split(':');
  const date = new Date(new Date(startedAt as Date).setHours(+time[0] || 0, +time[1] || 0));
  if (isNaN(+date)) return;

  emit('selectTime', date);
};

const getTimeDate = () => {
  const d = new Date(startedAt || new Date());
  return `${zeroFilter(d.getHours(), 2)}:${zeroFilter(d.getMinutes(), 2)}`;
};
</script>

<template>
  <div class="common-calendar--time flex-center-between">
    <div class="header fz14 gray">Введите время начала</div>
    <input
      v-mask="'##:##'"
      :value="getTimeDate()"
      type="text"
      @keyup="timeHandler(($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<style scoped lang="scss">
.common-calendar--time {
  margin-top: 12px;
  input {
    text-align: center;
    width: 64px;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid var(--border_color);
    background-color: var(--block_color);
    color: var(--white_color);
  }
}
</style>
