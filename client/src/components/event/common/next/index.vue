<script setup lang="ts">
import { EventDto } from '@/interfaces/event/event.dto';
import dateFilter from '@/filters/date.filter';

const emit = defineEmits<{
  (e: 'selectDate'): void;
}>();

defineProps<{
  event: EventDto;
}>();
</script>

<template>
  <div class="event-common-next flex-column flex-center">
    <div>Ближайшее:</div>
    <div class="yellow cursor-pointer text-center" @click="emit('selectDate')">
      {{ dateFilter(event.startedAt) }} | {{ event.name }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.event-common-next {
  margin-top: 32px;
  gap: 6px;
}
</style>
