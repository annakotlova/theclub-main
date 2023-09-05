<script setup lang="ts">
import { NotificationDto } from '../typings/notification.dto';
import { ICONS } from '../icons';

defineProps<{
  notification: NotificationDto;
}>();

const titles = {
  success: 'Успешно',
  warning: 'Предупреждение',
  info: 'Информация',
  error: 'Ошибка',
};
</script>

<template>
  <div class="flex cursor-pointer">
    <component :is="ICONS[notification.type]"></component>
    <div class="container fw500 lh18">
      <div class="title fz14">{{ titles[notification.type] }}</div>
      <div class="message fz12">
        <span>{{ notification.message }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.flex {
  gap: 14px;
  padding: 14px 18px;
  width: 400px;

  background: rgba(14, 14, 14, 0.8);
  backdrop-filter: blur(2px);
  border-radius: 12px;
  svg {
    $px: 28px;
    min-width: $px;
    width: $px;
    height: $px;
  }
  .container {
    .title {
      margin-bottom: 8px;
      text-transform: capitalize;
    }
    .message {
      opacity: 0.6;
    }
  }
}

@media (max-width: 680px) {
  .flex {
    max-width: 95%;
    width: unset;
  }
}
</style>
