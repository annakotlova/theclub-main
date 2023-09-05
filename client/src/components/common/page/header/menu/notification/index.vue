<script setup lang="ts">
import { computed } from 'vue';
import { useGlobalStore } from '@/store/global';

import CommonDrop from '@action/drop/index.vue';
import NotificationItem from './item/index.vue';
import IconNotificationDefault from '@icons/notification/default.vue';
import IconNotificationFill from '@icons/notification/fill.vue';

const global = useGlobalStore();

const updateViewed = () => {
  const list = global.notifications.filter((n) => !n.viewed).map((n) => n._id);
  if (list.length) global.updateViewedNotificationList(list);
};

const isViewed = computed(() => global.notifications.every((n) => n.viewed));
</script>

<template>
  <div class="notification">
    <common-drop element=".notification" :container="{ top: '52px', right: '0px' }">
      <template #header>
        <div class="notification-header cursor-pointer" @click="updateViewed">
          <icon-notification-default v-if="isViewed" size="24px"></icon-notification-default>
          <icon-notification-fill v-else size="24px"></icon-notification-fill>
        </div>
      </template>
      <template #container>
        <div v-if="global.notifications.length" class="notification-container">
          <notification-item
            v-for="item of global.notifications"
            :key="item._id"
            :item="item"
          ></notification-item>
        </div>
        <div v-else class="notification-container empty">
          <span>У вас нет уведомлений</span>
        </div>
      </template>
    </common-drop>
  </div>
</template>

<style scoped lang="scss">
.notification {
  position: relative;
  &-header {
    width: 24px;
    height: 24px;
  }
  &-container {
    width: 354px;
    max-height: 540px;
    overflow: auto;
    border-radius: 0 0 16px 16px;
    background-color: var(--black_color);
    box-shadow: 4px 4px 30px 0px rgba(0, 0, 0, 0.4);
    &.empty {
      padding: 24px;
      text-align: center;
    }
  }
}
</style>
