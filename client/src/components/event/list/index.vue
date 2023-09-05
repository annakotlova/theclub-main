<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useEventStore } from '@/store/event';
import calendar from '@/utils/calendar';
import eventAPI from '@/api/event';

import EventItem from './item/index.vue';
import CommonPreloader from '@page/preloader/index.vue';

const state = reactive({
  pending: {
    action: false,
  },
});

const eventStore = useEventStore();

const selectedEvent = computed(() => eventStore.item);
const events = computed(() => eventStore.list);
const pending = computed(() => eventStore.pending);

const eventAction = async (_id: string) => {
  if (state.pending.action) return;

  state.pending.action = true;
  try {
    const { data } = await eventAPI.action(_id);
    eventStore.updateItem(data, true);

    if (data.isMember) {
      const link = calendar.generate(data);
      const a = document.createElement('a');
      a.href = link.link;
      a.target = link.id === 'apple' ? '_self' : '_blank';
      a.click();
    }
  } finally {
    state.pending.action = false;
  }
};
</script>

<template>
  <div class="events-container flex-column">
    <template v-if="events.length && !pending">
      <transition-group name="fade">
        <event-item
          v-for="event of selectedEvent ? [selectedEvent] : events"
          :key="event._id"
          :event="event"
          @event-action="eventAction(event._id)"
        ></event-item>
      </transition-group>
    </template>
    <template v-else-if="pending">
      <div class="preloader">
        <common-preloader></common-preloader>
      </div>
    </template>
    <template v-else>По вашему запросу не найдено ни одного мероприятия!</template>
  </div>
</template>

<style scoped lang="scss">
.events-container {
  gap: 32px;
  .preloader {
    width: 100%;
    height: 400px;
  }
}
</style>
