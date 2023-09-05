<script setup lang="ts">
import { computed } from 'vue';
import { getDateNullTime, getYearList } from '@/utils/calendar/helper';

const emit = defineEmits(['selectYear']);
const { startedAt, month } = defineProps<{
  month: Date;
  startedAt?: Date | string;
}>();

const years = computed(() => getYearList(month));

const isSelectedYear = (date: Date) => startedAt && +date === +getDateNullTime(new Date(startedAt), 'year');
</script>

<template>
  <div class="common-calendar--wrapper">
    <div class="years flex flex-ww">
      <div
        class="year cursor-pointer"
        v-for="(date, index) of years"
        :key="index"
        :class="{ selected: isSelectedYear(date) }"
        @click.stop="emit('selectYear', date)"
      >
        {{ date.getFullYear() }}
      </div>
    </div>
  </div>
</template>
