<script setup lang="ts">
import { computed, reactive } from 'vue';
import { dayWeekList, getWeeks } from '@/utils/calendar/helper';
import dateFilter from '@/filters/date.filter';

const emit = defineEmits<{
  (e: 'selectDate', date: Date): void;
}>();

const { startedAt, month } = defineProps<{
  month: Date;
  startedAt?: Date | string;
}>();

const state = reactive({
  dayweek: dayWeekList(),
});

const isSelectedDate = (date: Date) => {
  return dateFilter(date) === dateFilter(startedAt || '');
};

const isCurrentDate = (date: Date) => {
  return dateFilter(date) === dateFilter(new Date());
};

const selectDate = (date: Date) => {
  const current = new Date();
  date = new Date(date.setHours(current.getHours(), current.getMinutes()));

  emit('selectDate', date);
};

const weekList = computed(() => {
  return getWeeks(month) as Record<string, any>[][];
});
</script>

<template>
  <div class="common-calendar--wrapper">
    <div class="dayweek flex">
      <div class="day" v-for="day of state.dayweek" :key="day">{{ day }}</div>
    </div>
    <div class="weeks">
      <div class="week flex" v-for="(week, index) of weekList" :key="index">
        <div
          class="date cursor-pointer"
          @click="selectDate(date.value)"
          :class="[
            date.type,
            { today: isCurrentDate(date.value) },
            { selected: isSelectedDate(date.value) },
          ]"
          v-for="(date, index) of week"
          :key="index"
        >
          {{ date.value.getDate() }}
        </div>
      </div>
    </div>
  </div>
</template>
