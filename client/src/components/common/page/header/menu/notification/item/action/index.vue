<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { NotificationDto, NotificationType } from '@/interfaces/notification/notification.dto';
import { EventStatus } from '@/interfaces/event/event.dto';

const ActionEventReview = defineAsyncComponent(() => import('./review/index.vue'));
const ActionSupportJoin = defineAsyncComponent(() => import('./support/Join.vue'));
const ActionWaitingList = defineAsyncComponent(() => import('./waiting/List.vue'));

const { item } = defineProps<{
  item: NotificationDto;
}>();

const isCanceled = computed(() =>
  [EventStatus.BLOCKED, EventStatus.CANCELED].includes(item.event?.status),
);
</script>

<template>
  <div class="item-action">
    <div v-if="isCanceled" class="canceled yellow fz14 fw500">Мероприятие было отменено</div>
    <action-event-review
      v-else-if="item.type === NotificationType.EVENT_REVIEW"
      :event="item.event._id"
      :is-canceled="isCanceled"
    ></action-event-review>
    <action-support-join
      v-else-if="item.type === NotificationType.SUPPORT_JOIN"
      :event="item.event._id"
      :is-canceled="isCanceled"
      :approved="item.meta.approved"
    ></action-support-join>
    <action-waiting-list
      v-else-if="item.type === NotificationType.WAITING_LIST"
      :event="item.event._id"
      :is-canceled="isCanceled"
      :approved="item.meta.approved"
    ></action-waiting-list>
  </div>
</template>

<style scoped lang="scss"></style>
