<script setup lang="ts">
import { computed } from 'vue';
import dateFilter from '@/filters/date.filter';

import IconCalendar from '@icons/common/calendar.vue';

const { startedAt, time } = defineProps<{
  startedAt?: Date | string;
  time: boolean;
}>();

const currentDate = computed(() =>
  !startedAt ? 'Выберите дату' : dateFilter(startedAt, time ? 'datetimeyear' : 'dateyear'),
);
</script>

<template>
  <div class="calendar-header cursor-pointer white flex flex-ic fz14">
    <icon-calendar size="24px"></icon-calendar>
    <span :class="{ gray: !startedAt }">{{ currentDate }}</span>
  </div>
</template>

<style scoped lang="scss">
.calendar-header {
  font-size: 16px;
  background-color: var(--black_color);
  border: 1px solid var(--border_color);
  color: var(--white_color);
  border-radius: 12px;
  padding: 12px 12px 11px;
  gap: 8px;
  &.black {
    padding: 12px;
    font-size: 16px;
    background-color: var(--black_color);
    border: none;
    &::placeholder {
      font-size: 16px;
    }
    &:focus {
      border: none;
    }
  }
}
</style>
