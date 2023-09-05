<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { NotificationDto, NotificationType } from '@/interfaces/notification/notification.dto';

import ItemTitle from './title/index.vue';
const ItemAction = defineAsyncComponent(() => import('./action/index.vue'));

const { item } = defineProps<{
  item: NotificationDto;
}>();

const isAction = computed(
  () =>
    [
      NotificationType.EVENT_REVIEW,
      NotificationType.WAITING_LIST,
      NotificationType.SUPPORT_JOIN,
    ].includes(item.type) && item.event,
);
</script>

<template>
  <div class="item flex-column">
    <item-title :type="item.type" :date="item.createdAt"></item-title>
    <div class="item-content fz14">{{ item.content }}</div>
    <item-action v-if="isAction" :item="item"></item-action>
  </div>
</template>

<style scoped lang="scss">
.item {
  gap: 12px;
  padding: 16px;
  &:not(:last-child) {
    border-bottom: 1px solid var(--darkborder_color);
  }
}
</style>
