<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/store/user';
import { EventCategory, EventDto } from '@/interfaces/event/event.dto';

const emit = defineEmits<{
  (e: 'eventAction'): void;
  (e: 'eventLink'): void;
  (e: 'eventQrcode'): void;
}>();

const { event } = defineProps<{
  event: EventDto;
}>();

const userStore = useUserStore();
const isOnline = computed(() => event.category === EventCategory.ONLINE);
const isOffline = computed(() => event.category === EventCategory.OFFLINE && !!event.qrcode);
const isCreator = computed(() => userStore.user?._id === event.creator._id);

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
  <div class="event-action flex-column">
    <button v-if="isOnline && event.link" class="btn btn-main btn-small btn-max" @click="emit('eventLink')">
      Подключиться онлайн
    </button>
    <button v-else-if="isOnline" class="btn btn-main btn-small btn-max">
      Ссылка уточняется
    </button>
    <button v-if="isOffline" class="btn btn-main btn-small btn-max" @click="emit('eventQrcode')">
      Показать QR-код
    </button>
    <button
      v-if="!isCreator"
      class="btn btn-border btn-small btn-max fw300"
      @click="emit('eventAction')"
    >
      {{ currentActionName }}
    </button>
  </div>
</template>

<style scoped lang="scss">
.event-action {
  gap: 12px;
}
</style>
