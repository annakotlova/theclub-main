import { ref } from 'vue';
import { defineStore } from 'pinia';
import { NotificationDto } from '@/interfaces/notification/notification.dto';
import notificationAPI from '@/api/notification';

export const useGlobalStore = defineStore('global', () => {
  const pending = ref<boolean>(false);
  const isMobile = ref<boolean>(window.innerWidth <= 960);
  const rooms = ref<Array<string>>([]);
  const notifications = ref<Array<NotificationDto>>([]);

  const getNotificationList = async () => {
    const { data } = await notificationAPI.getList();
    notifications.value = data;
  };

  const createNotification = (notification: NotificationDto) => {
    notifications.value = [notification, ...notifications.value];
  };

  const updateViewedNotificationList = async (list: Array<string>) => {
    await notificationAPI.updateViewed(list);
    for (const item of notifications.value) item.viewed = true;
  };

  const updatePendingStatus = (data: boolean) => (pending.value = data);
  const updateInnerWidth = () => (isMobile.value = window.innerWidth <= 960);
  const updateRooms = (room: string) => (rooms.value = [...rooms.value, room]);

  const destroyRoom = (room: string) => (rooms.value = rooms.value.filter((r) => r !== room));

  const deleteNotification = (item: NotificationDto) => {
    notifications.value = notifications.value.filter(
      (n) => n.type !== item.type && n.event?._id !== item.event?._id,
    );
  };

  return {
    pending,
    isMobile,
    rooms,
    notifications,

    getNotificationList,

    createNotification,

    updateViewedNotificationList,
    updatePendingStatus,
    updateInnerWidth,
    updateRooms,
    destroyRoom,

    deleteNotification,
  };
});
