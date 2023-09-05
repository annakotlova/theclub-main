<script lang="ts">
import { onMounted, onUnmounted, defineComponent, defineAsyncComponent } from 'vue';
import { EventDto } from '@/interfaces/event/event.dto';
export default defineComponent({
  name: 'main-layout',
  inheritAttrs: false,
  customOptions: {},
});
</script>

<script setup lang="ts">
import { useAuthStore } from '@/store/auth';
import { useEmitter } from '@/use/emitter';
import { useUserStore } from '@/store/user';
import { useModalStore } from '@/store/modal';
import { useEventStore } from '@/store/event';
import { useGlobalStore } from '@/store/global';
import { PaymentDto } from '@/interfaces/payment/payment.dto';
import { NotificationDto } from '@/interfaces/notification/notification.dto';
import {
  SocketCommonAction,
  SocketEvent,
  SocketEventAction,
  SocketNotificationAction,
  SocketUserAction,
} from '@/utils/enums/socket';
import { UserDto } from '@/interfaces/user/user.dto';
import socket from '@/socket';

import CommonSidebar from '@page/sidebar/index.vue';
import CommonHeader from '@page/header/index.vue';
const Modal = defineAsyncComponent(() => import('@action/modal/index.vue'));

const global = useGlobalStore();
const user = useUserStore();
const event = useEventStore();
const auth = useAuthStore();
const emitter = useEmitter();
const modal = useModalStore();

const focusHandler = () => {
  socket.checkConnection();
};

const userAction = ({ action }: { data: UserDto; action: SocketUserAction }) => {
  if (action === 'delete') return auth.logout();
};

const eventAction = ({ data, action }: { data: EventDto; action: SocketEventAction }) => {
  if (action === 'update') return event.updateSocket(data);
  if (action === 'delete') return event.deleteSocket(data);
};

const commonAction = ({ data }: { data: any; action: SocketCommonAction }) => {
  console.log(data);
};

const notificationAction = ({
  data,
  action,
}: {
  data: NotificationDto;
  action: SocketCommonAction;
}) => {
  if (action === 'delete') return global.deleteNotification(data);
  if (action === 'create') return global.createNotification(data);
};

const authActionEmitter = () => {
  auth.verification();
};

const userActionEmitter = ({ data, action }: { data: UserDto; action: 'update' }) => {
  if (['update', 'phone'].includes(action)) return user.updateUser(data);
};

const paymentActionEmitter = ({ data }: { data: PaymentDto; action: 'cancel' }) => {
  user.updatePayment(data);
};

const initialData = async () => {
  await Promise.all([
    global.getNotificationList(),
    event.getEventListDate(),
    user.getReferral('limit'),
    user.getPayment(),
  ]);
};

onMounted(() => {
  window.addEventListener('focus', focusHandler);

  socket.on(SocketEvent.USER_ACTION, userAction);
  socket.on(SocketEvent.EVENT_ACTION, eventAction);
  socket.on(SocketEvent.COMMON_ACTION, commonAction);
  socket.on(SocketEvent.NOTIFICATION_ACTION, notificationAction);

  emitter.on('auth-action', authActionEmitter);
  emitter.on('user-action', userActionEmitter);
  emitter.on('payment-action', paymentActionEmitter);
});

onUnmounted(() => {
  window.removeEventListener('focus', focusHandler);

  socket.off(SocketEvent.USER_ACTION);
  socket.off(SocketEvent.EVENT_ACTION);
  socket.off(SocketEvent.COMMON_ACTION);
  socket.off(SocketEvent.NOTIFICATION_ACTION);

  emitter.off('auth-action');
  emitter.off('user-action');
  emitter.off('payment-action');
});

socket.connect();
initialData();
</script>

<template>
  <section class="page">
    <common-header></common-header>
    <div class="page-main flex">
      <common-sidebar></common-sidebar>
      <router-view></router-view>
    </div>
    <transition name="fade">
      <Modal v-if="modal.modal"></Modal>
    </transition>
  </section>
</template>

<style lang="scss">
.page {
  &-main {
    padding-bottom: 32px;
    gap: 32px;
    > section {
      flex: 1 1 auto;
    }
  }
}
</style>
