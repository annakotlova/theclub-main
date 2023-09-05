<script setup lang="ts">
import { reactive } from 'vue';
import { CalendarOptions } from '@/interfaces/common/calendar.dto';

import CommonDrop from '@action/drop/index.vue';
import CalendarHeader from './header/index.vue';
import CalendarContainer from './container/index.vue';

const emit = defineEmits<{
  (e: 'apply', dates: Date): void;
}>();

const { startedAt, time = false } = defineProps<{
  startedAt?: Date | string;
  time?: boolean;
  className?: string;
}>();

const options: CalendarOptions = {
  id: 'calendar',
  time,
};

const state = reactive({
  startedAt,
});

const apply = (d: Date) => {
  state.startedAt = d;
  emit('apply', d);
};
</script>

<template>
  <div class="calendar">
    <common-drop element=".calendar" :container="{ top: '56px', left: '0px', maxHeight: 'unset' }">
      <template #header>
        <calendar-header :started-at="startedAt" :time="time" :class="className"></calendar-header>
      </template>
      <template #container="{ toggle }">
        <calendar-container
          :started-at="state.startedAt"
          :options="options"
          @select-time="(d) => emit('apply', d)"
          @select-date="
            (d) => {
              if (!time) toggle(false);
              apply(d);
            }
          "
        ></calendar-container>
      </template>
    </common-drop>
  </div>
</template>

<style scoped lang="scss"></style>
