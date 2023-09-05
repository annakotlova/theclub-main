<script setup lang="ts">
import { reactive } from 'vue';
import { switchMonth } from '../helper';

import CalendarHeader from './Header.vue';
import CalendarDates from './Dates.vue';

const emit = defineEmits<{
  (e: 'selectDate', date: Date): void;
}>();

defineProps<{
  date: Date;
}>();

const state = reactive({
  month: new Date(),
});

const updateMonth = (inc: 1 | -1) => {
  state.month = switchMonth(state.month, inc);
};
</script>

<template>
  <div class="calendar flex-column">
    <calendar-header :month="state.month" @update-month="updateMonth"></calendar-header>
    <calendar-dates
      :date="date"
      :month="state.month"
      @select-date="(d) => emit('selectDate', d)"
    ></calendar-dates>
  </div>
</template>

<style lang="scss">
@import '../helper/index.scss';
</style>
