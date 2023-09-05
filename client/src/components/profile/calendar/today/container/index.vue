<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { EventDto, EventStatus } from '@/interfaces/event/event.dto';
import { useUserStore } from '@/store/user';

import EventCover from './cover/index.vue';
import EventAction from './action/index.vue';
import EventContainer from './container/index.vue';
import EventCommonCreator from '@/components/event/common/creator/index.vue';
const EventCommonActions = defineAsyncComponent(
  () => import('@/components/event/common/actions/index.vue'),
);

const emit = defineEmits<{
  (e: 'eventLink'): void;
  (e: 'eventAction'): void;
  (e: 'eventQrcode'): void;
}>();

const { event } = defineProps<{
  event: EventDto;
}>();

const userStore = useUserStore();
const isActions = computed(() => {
  return (
    userStore.user?._id === event.creator._id &&
    ![EventStatus.CANCELED, EventStatus.BLOCKED].includes(event.status)
  );
});
const isCanceled = computed(() =>
  [EventStatus.CANCELED, EventStatus.BLOCKED].includes(event.status),
);
</script>

<template>
  <div class="event flex-column">
    <div class="event-header flex-center-between">
      <event-common-creator :creator="event.creator"></event-common-creator>
      <event-common-actions v-if="isActions" :event="event"></event-common-actions>
    </div>
    <event-cover v-if="event.cover" :cover="event.cover"></event-cover>
    <event-container :event="event"></event-container>
    <event-action
      v-if="!isCanceled"
      :event="event"
      @event-action="emit('eventAction')"
      @event-link="emit('eventLink')"
      @event-qrcode="emit('eventQrcode')"
    ></event-action>
  </div>
</template>

<style scoped lang="scss">
.event {
  gap: 16px;
  flex: 1 1 auto;
  overflow: auto;
}
</style>
