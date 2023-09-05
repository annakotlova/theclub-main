<script setup lang="ts">
import { computed } from 'vue';
import { EventDto } from '@/interfaces/event/event.dto';
import dateFilter from '@/filters/date.filter';

const emit = defineEmits<{
  (e: 'selectEvent', event: string): void;
}>();

const props = defineProps<{
  events: Array<EventDto>;
  dates: {
    date: Date;
    today: Date;
  };
}>();

const currentDate = computed(() =>
  +props.dates.date === +props.dates.today ? 'сегодня' : dateFilter(props.dates.date),
);
</script>

<template>
  <div class="today flex-column">
    <div v-if="!events.length" class="today-empty text-center fz14">
      <span>На {{ currentDate }} мероприятий нет</span>
    </div>
    <template v-else>
      <div
        class="today-event flex flex-ic cursor-pointer"
        v-for="event of events"
        @click="emit('selectEvent', event._id)"
      >
        <div class="circle"></div>
        <div class="yellow text text-1 fw300">{{ event.name }}</div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.today {
  gap: 8px;
  .today-event {
    gap: 12px;
    .circle {
      $px: 4px;
      min-width: $px;
      width: $px;
      height: $px;
      border-radius: $px;
      background-color: var(--yellow_color);
    }
  }
}
</style>
