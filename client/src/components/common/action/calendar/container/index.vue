<script setup lang="ts">
import { reactive, computed, defineAsyncComponent, CSSProperties } from 'vue';
import { switchMonth, MonthNames } from '@/utils/calendar/helper';
import { CalendarMode, CalendarOptions } from '@/interfaces/common/calendar.dto';

import ModeDates from './mode/Dates.vue';
import IconArrowDown from '@icons/arrow/down.vue';
const ModeTime = defineAsyncComponent(() => import('./mode/Time.vue'));
const ModeYears = defineAsyncComponent(() => import('./mode/Years.vue'));
const ModeMonths = defineAsyncComponent(() => import('./mode/Months.vue'));

const emit = defineEmits<{
  (e: 'selectDate', date: Date): void;
  (e: 'selectTime', date: Date): void;
}>();

defineProps<{
  options: CalendarOptions;
  startedAt?: Date | string;
}>();

const state = reactive({
  month: new Date(),
  mode: 'dates' as CalendarMode,
});

const modeHandler = () => {
  if (state.mode === 'dates') return (state.mode = 'months');
  if (state.mode === 'months') return (state.mode = 'years');
  if (state.mode === 'years') return (state.mode = 'dates');
};

const updateMonth = (inc: number) => {
  state.month = switchMonth(state.month, inc, state.mode);
};

const selectMonth = (date: Date) => {
  state.month.setMonth(date.getMonth(), 1);
  state.mode = 'dates';
};

const selectYear = (date: Date) => {
  state.month.setFullYear(date.getFullYear());
  state.mode = 'months';
};

const monthFilter = computed(() => {
  const month = MonthNames[state.month.getMonth()];
  const year = state.month.getFullYear();

  if (state.mode === 'dates') return `${month}, ${year}`;
  if (state.mode === 'months') return `${year}`;

  const firstYear = Math.floor(year / 10) * 10;
  return `${firstYear} - ${firstYear + 10}`;
});

const getCurrentStyle = () => {
  const styles = { left: '0px' } as CSSProperties;
  return styles;
};
</script>

<template>
  <div class="common-calendar" :style="getCurrentStyle()">
    <div class="common-calendar--container">
      <div class="common-calendar--month flex-center">
        <div class="prev flex-center" @click="updateMonth(-1)">
          <icon-arrow-down class-list="white_filter"></icon-arrow-down>
        </div>
        <div class="type-name cursor-pointer" @click="modeHandler">
          {{ monthFilter }}
        </div>
        <div class="next flex-center" @click="updateMonth(1)">
          <icon-arrow-down class-list="white_filter"></icon-arrow-down>
        </div>
      </div>
      <div class="common-calendar--mode">
        <mode-dates
          v-if="state.mode === 'dates'"
          :started-at="startedAt"
          :month="state.month"
          @select-date="(d) => emit('selectDate', d)"
        ></mode-dates>
        <mode-months
          v-if="state.mode === 'months'"
          :started-at="startedAt"
          :month="state.month"
          @select-month="selectMonth"
        ></mode-months>
        <mode-years
          v-if="state.mode === 'years'"
          :started-at="startedAt"
          :month="state.month"
          @select-year="selectYear"
        ></mode-years>
      </div>
      <mode-time
        v-if="state.mode === 'dates' && options.time"
        :started-at="startedAt"
        @select-time="(d) => emit('selectTime', d)"
      ></mode-time>
    </div>
  </div>
</template>

<style lang="scss">
@import './calendar.scss';
.common-calendar {
  width: 284px;
}
</style>
