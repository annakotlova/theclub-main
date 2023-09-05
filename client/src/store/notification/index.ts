import { ref } from 'vue';
import { defineStore } from 'pinia';
import { NotificationDto } from '@/plugins/notification/typings/notification.dto';

export const useNotificationStore = defineStore('notification', () => {
  const notification = ref<NotificationDto | null>(null);

  const create = (data: NotificationDto) => {
    notification.value = data;
  };

  const destroy = () => {
    notification.value = null;
  };

  return {
    notification,
    create,
    destroy,
  };
});
