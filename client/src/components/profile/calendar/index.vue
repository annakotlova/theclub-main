<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive } from 'vue';
import { useEventStore } from '@/store/event';
import { getDateNullTime } from '@/plugins/calendar/helper';
import { useGlobalStore } from '@/store/global';

import CommonCalendar from '@/plugins/calendar/components/Main.vue';
import EventToday from './today/index.vue';
import EventToggle from './toggle/index.vue';

const global = useGlobalStore();
const eventStore = useEventStore();
const eventList = computed(() => eventStore.memberList);

const state = reactive({
  showEvent: false,
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

const selectDate = (date: Date) => {
  state.dates.date = getDateNullTime(date);
  if (eventDate.value.length) eventStore.getEvent(eventDate.value[0]._id);
};

onMounted(() => {
  setTimeout(() => {
    selectDate(new Date());
  }, 150);
});

onUnmounted(() => {
  eventStore.destroyItem();
});
</script>

<template>
  <section class="profile-calendar common-block">
    <event-toggle
      v-if="global.isMobile"
      :show="state.showEvent"
      @toggle="state.showEvent = !state.showEvent"
    ></event-toggle>
    <event-today
      v-if="state.showEvent || !global.isMobile"
      :dates="state.dates"
      :events="eventDate"
      :next-event="nextEvent"
      @select-date="selectDate"
    ></event-today>
    <common-calendar
      v-if="!state.showEvent"
      class="profile"
      :date="state.dates.date"
      @select-date="selectDate"
    ></common-calendar>
  </section>
</template>

<style scoped lang="scss">
.profile-calendar {
  position: relative;
  background-color: var(--block_color);
  padding: 100px 100px 100px 30%;
}

@media (max-width: 1280px) {
  .profile-calendar {
    padding: 80px 80px 80px 280px;
  }
}

@media (max-width: 960px) {
  .profile-calendar {
    padding: 32px;
  }
}

@media (max-width: 440px) {
  .profile-calendar {
    padding: 16px;
  }
}
</style>
