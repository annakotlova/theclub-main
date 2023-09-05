<script setup lang="ts">
import { EventDto } from '@/interfaces/event/event.dto';

const emit = defineEmits<{
  (e: 'selectEvent', event: string): void;
}>();

defineProps<{
  events: Array<EventDto>;
  selected?: string;
}>();
</script>

<template>
  <div class="counter flex-column">
    <div class="counter-title fw200">Мероприятия сегодня:</div>
    <div class="counter-container flex flex-ic">
      <div
        class="event gray flex-center cursor-pointer"
        v-for="(event, index) of events"
        :key="event._id"
        :class="{ selected: selected === event._id }"
        @click="emit('selectEvent', event._id)"
      >
        {{ index + 1 }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.counter {
  gap: 8px;
  &-container {
    gap: 8px;
    .event {
      $px: 26px;
      width: $px;
      height: $px;
      border-radius: $px;
      transition: 0.3s all;
      &.selected {
        background-color: var(--yellow_color);
        color: var(--black_color);
        transition: 0.3s all;
      }
    }
  }
}
</style>
