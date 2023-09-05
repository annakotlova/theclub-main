<script setup lang="ts">
import { computed } from 'vue';
import { getDateNullTime, getMonthList, MonthNamesCir } from '@/utils/calendar/helper';

const emit = defineEmits(['selectMonth']);
const { startedAt, month } = defineProps<{
  month: Date;
  startedAt?: Date | string;
}>();

const months = computed(() => getMonthList(month));

const isSelectedMonth = (date: Date) => startedAt && +date === +getDateNullTime(new Date(startedAt), 'month');
</script>

<template>
  <div class="common-calendar--wrapper">
    <div class="months flex flex-ww">
      <div
        class="month cursor-pointer"
        v-for="(date, index) of months"
        :key="index"
        :class="{ selected: isSelectedMonth(date) }"
        @click.stop="emit('selectMonth', date)"
      >
        {{ MonthNamesCir[date.getMonth()] }}
      </div>
    </div>
  </div>
</template>
