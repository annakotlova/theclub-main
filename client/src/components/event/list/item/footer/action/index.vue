<script setup lang="ts">
import { computed } from 'vue';
import { EventCategory, EventDto } from '@/interfaces/event/event.dto';

const emit = defineEmits<{
  (e: 'eventAction'): void;
  (e: 'eventQrcode'): void;
}>();

const { event } = defineProps<{
  event: EventDto;
}>();

const isOnline = computed(() => event.category === EventCategory.ONLINE && event.isMember);
const isOffline = computed(() => event.category === EventCategory.OFFLINE && !!event.qrcode);

const currentActionName = computed(() => {
  const isFullMembers = event.maxMembers <= event.members.length;
  const isMember = event.isMember;
  const isWaiting = event.isWaiting;

  if (isWaiting) return 'Выйти из листа ожидания';
  if (isMember) return 'Отписаться';
  if (isFullMembers) return 'В лист ожидания';
  return 'Записаться';
});
</script>

<template>
  <div class="event-footer--action flex flex-ic flex-ww">
    <a v-if="isOnline && event.link" :href="event.link" target="_blank">
      <button class="btn btn-border">Подключиться онлайн</button>
    </a>
    <button v-else-if="isOnline" class="btn btn-border">Ссылка уточняется</button>
    <button v-if="isOffline" class="btn btn-main btn" @click="emit('eventQrcode')">
      Показать QR-код
    </button>
    <button class="btn btn-main" @click="emit('eventAction')">
      {{ currentActionName }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.event-footer--action {
  button {
    padding: 12px 32px;
    width: inherit;
  }
}
</style>
