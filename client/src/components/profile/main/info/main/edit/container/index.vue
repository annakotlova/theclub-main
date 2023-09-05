<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/store/user';

const emit = defineEmits<{
  (e: 'action', action: string, data: any): void;
}>();

const userStore = useUserStore();

const list = computed(() => [
  { show: true, name: 'Редактировать профиль', action: 'user-update', data: {} },
  { show: true, name: 'Продлить подписку', action: 'subscription-extend', data: {} },
  { show: true, name: 'Сменить пароль', action: 'user-password', data: { password: '', repeatPassword: '' } },
  { show: true, name: 'Сменить номер телефона', action: 'user-phone', data: { phone: '', code: '' } },
  { show: !userStore.payment?.cancel, name: 'Отменить подписку', action: 'subscription-cancel', data: {} },
]);
</script>

<template>
  <ul class="edit-container flex-column">
    <li
      class="fz14 cursor-pointer"
      v-for="item of list.filter((item) => item.show)"
      :key="item.action"
      @click="emit('action', item.action, item.data)"
    >
      {{ item.name }}
    </li>
  </ul>
</template>

<style scoped lang="scss">
.edit-container {
  width: 220px;
  padding: 48px 16px 16px;
  border-radius: 16px;
  background-color: var(--yellow_color);
  z-index: 2;
  gap: 12px;
}
</style>
