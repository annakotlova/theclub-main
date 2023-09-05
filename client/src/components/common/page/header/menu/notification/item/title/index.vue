<script setup lang="ts">
import dateFilter from '@/filters/date.filter';
import { NotificationType } from '@/interfaces/notification/notification.dto';

defineProps<{
  type: NotificationType;
  date: Date | string;
}>();

const titles = {
  DEFAULT: 'Напоминание',
  WARNING: 'Внимание!',

  WAITING_LIST: 'Есть свободное место!',
  SUPPORT_SELECT: 'Выбрать помощника',
  SUPPORT_JOIN: 'Хотите стать помощником?',
  SUPPORT_LEAVE: 'Больше не помощник',

  EVENT_LEAVE: 'EVENT_LEAVE',
  EVENT_REVIEW: 'Напоминание',
  EVENT_BLOCKED: 'Внимание!',
  EVENT_CANCELED: 'Мероприятие не состоится',
  EVENT_UNBLOCKED: 'Внимание!',
  EVENT_UPDATE_NAME: 'Смена название',
  EVENT_UPDATE_DATE: 'Смена времени начала',
  EVENT_UPDATE_PLACE: 'Смена локации',
  EVENT_CANCELED_MEMBER: 'EVENT_CANCELED_MEMBER',
};
</script>

<template>
  <div class="item-title flex-center-between">
    <span class="fw600">{{ titles[type] }}</span>
    <span class="fz12">{{ dateFilter(date, 'datetime') }}</span>
  </div>
</template>

<style scoped lang="scss"></style>
