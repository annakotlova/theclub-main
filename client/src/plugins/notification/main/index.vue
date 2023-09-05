<script setup lang="ts">
import { reactive } from 'vue';
import { useNotificationStore } from '@/store/notification';
import { NotificationDto } from '../typings/notification.dto';
import Instance from './Instance.vue';

const notificationStore = useNotificationStore();

const state = reactive({
  notifications: [] as Array<NotificationDto>,
});

const destroyInstance = (id: number) => {
  state.notifications = state.notifications.filter((notification) => notification.id !== id);
};

const generateInstance = (notification: NotificationDto) => {
  const notif = {
    id: Math.floor(Math.random() * 10001),
    ...(notification as NotificationDto),
  };
  state.notifications = [...state.notifications, notif];
  setTimeout(() => {
    destroyInstance(notif.id);
  }, notif.timeout || 5000);
};

notificationStore.$subscribe((_mutation, state) => {
  if (state.notification) generateInstance(state.notification);
});
</script>

<template>
  <section class="notifications flex-column">
    <transition-group name="notification">
      <instance
        v-for="(notification, index) of state.notifications"
        :key="index"
        :notification="notification"
        @click="destroyInstance(notification.id as number)"
      ></instance>
    </transition-group>
  </section>
</template>

<style scoped lang="scss">
.notifications {
  position: fixed;
  top: 92px;
  right: 16px;
  gap: 12px;
  z-index: 9999;
  align-items: flex-end;
}
</style>
