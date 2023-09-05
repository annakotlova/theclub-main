<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useEventStore } from '@/store/event';
import { getDateNullTime } from '@/plugins/calendar/helper';

import EventToday from './today/index.vue';
import EventCommonNext from '../common/next/index.vue';
import CommonCalendar from '@/plugins/calendar/components/Main.vue';

const eventStore = useEventStore();
const eventList = computed(() => eventStore.memberList);

const emit = defineEmits<{
  (e: 'selectEvent'): void;
}>();

defineProps<{
  drop?: boolean;
}>();

const state = reactive({
  dates: {
    date: getDateNullTime(new Date()),
    today: getDateNullTime(new Date()),
  },
});

const eventDate = computed(() =>
  eventList.value.filter((e) => +getDateNullTime(e.startedAt) === +state.dates.date),
);

const nextEvent = computed(() => {
  return eventList.value.find((e) => +getDateNullTime(e.startedAt) > +state.dates.date);
});

const selectEvent = async (_id: string) => {
  await eventStore.getEvent(_id);
  emit('selectEvent');
};

const selectDate = (date: Date) => {
  state.dates.date = getDateNullTime(date);
};
</script>

<template>
  <section class="event-calendar flex-column">
    <div v-if="!drop" class="event-calendar--header fz28 fw500">сборник дат</div>
    <div class="event-calendar--container white" :class="{ drop }">
      <common-calendar :date="state.dates.date" @select-date="selectDate"></common-calendar>
      <div class="separator"></div>
      <event-today
        :dates="state.dates"
        :events="eventDate"
        @select-event="selectEvent"
      ></event-today>
      <event-common-next
        v-if="nextEvent"
        class="fz14"
        :event="nextEvent"
        @select-date="selectDate(nextEvent.startedAt)"
      ></event-common-next>
    </div>
  </section>
</template>

<style scoped lang="scss">
.event-calendar {
  gap: 16px;
  &--header {
    text-transform: uppercase;
  }
  &--container {
    background-color: var(--block_color);
    border-radius: 24px;
    padding: 24px;
    &.drop {
      width: 320px;
      background: var(--black_opacity_color);
      border: 1px solid var(--black_color);
      backdrop-filter: blur(5px);
      border-radius: 16px;
    }
  }
  .separator {
    margin: 16px 0;
    width: 100%;
    height: 1px;
    background-color: var(--black_color);
  }
  .event-next {
    margin-top: 18px;
    gap: 12px;
  }
}
</style>
