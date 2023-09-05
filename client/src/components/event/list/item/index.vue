<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { EventDto, EventStatus } from '@/interfaces/event/event.dto';

import EventHeader from './header/index.vue';
import EventContainer from './container/index.vue';
const EventFooter = defineAsyncComponent(() => import('./footer/index.vue'));
const EventFooterCanceled = defineAsyncComponent(() => import('./footer/status/Canceled.vue'));

const emit = defineEmits<{
  (e: 'eventAction'): void;
}>();

const { event } = defineProps<{
  event: EventDto;
}>();

const isCanceled = computed(() =>
  [EventStatus.CANCELED, EventStatus.BLOCKED].includes(event.status),
);
</script>

<template>
  <section class="event flex-column">
    <event-header :event="event"></event-header>
    <event-container :event="event"></event-container>
    <event-footer-canceled v-if="isCanceled"></event-footer-canceled>
    <event-footer v-else :event="event" @event-action="emit('eventAction')"></event-footer>
  </section>
</template>

<style scoped lang="scss">
.event {
  gap: 28px;
  padding: 32px;
  border-radius: 12px;
  background-color: var(--block_color);
}

@media (max-width: 720px) {
  .event {
    gap: 24px;
    padding: 24px 16px;
  }
}
</style>
