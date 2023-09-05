<script setup lang="ts">
import { computed, reactive } from 'vue';
import { dayWeekList, getWeeks, DateValue, getDateNullTime } from '@/plugins/calendar/helper';
import { useEventStore } from '@/store/event';
import dateFilter from '@/filters/date.filter';

const emit = defineEmits<{
  (e: 'selectDate', date: Date): void;
}>();

const props = defineProps<{
  month: Date;
  date: Date;
}>();

const eventStore = useEventStore();
const eventList = computed(() => eventStore.memberList);
const state = reactive({
  dayweek: dayWeekList(),
});

const isEventedDate = (date: Date) => {
  return !!eventList.value.find((e) => +getDateNullTime(e.startedAt) === +getDateNullTime(date));
};

const isSelectedDate = (date: Date) => {
  return dateFilter(date) === dateFilter(props.date);
};

const selectDate = (date: Date) => {
  const current = new Date();
  date = new Date(date.setHours(current.getHours(), current.getMinutes()));

  emit('selectDate', date);
};

const weekList = computed(() => {
  return getWeeks(props.month) as Array<Array<DateValue>>;
});
</script>

<template>
  <div class="calendar-container flex-column">
    <div class="dayweek flex">
      <div class="day" v-for="day of state.dayweek" :key="day">{{ day }}</div>
    </div>
    <div class="weeks">
      <div class="week flex" v-for="(week, index) of weekList" :key="index">
        <div
          class="date cursor-pointer flex-center"
          @click="selectDate(date.value)"
          :class="[
            date.type,
            { selected: isSelectedDate(date.value) },
            { border: isEventedDate(date.value) },
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
