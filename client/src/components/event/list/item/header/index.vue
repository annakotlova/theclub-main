<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { EventDto, EventStatus } from '@/interfaces/event/event.dto';
import { useUserStore } from '@/store/user';

import EventCommonCreator from '@/components/event/common/creator/index.vue';
const EventCommonActions = defineAsyncComponent(
  () => import('@/components/event/common/actions/index.vue'),
);

const { event } = defineProps<{
  event: EventDto;
}>();

const userStore = useUserStore();
const isActions = computed(() => {
  return userStore.user?._id === event.creator._id && ![EventStatus.CANCELED, EventStatus.BLOCKED].includes(event.status);
});
</script>

<template>
  <header class="event-header flex-center-between">
    <event-common-creator class="fz16" :creator="event.creator"></event-common-creator>
    <event-common-actions
      v-if="isActions"
      :event="event"
    ></event-common-actions>
  </header>
</template>

<style scoped lang="scss"></style>
