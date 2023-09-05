<script setup lang="ts">
import IconCommonCalendar from '@icons/common/calendar.vue';

const emit = defineEmits<{
  (e: 'toggle'): void;
}>();

defineProps<{
  show: boolean;
}>();
</script>

<template>
  <div class="event-toggle flex flex-ic cursor-pointer" @click="emit('toggle')">
    <icon-common-calendar size="24px"></icon-common-calendar>
    <span class="gray fz14">{{ show ? 'Календарь' : 'Показ событий' }}</span>
  </div>
</template>

<style scoped lang="scss">
.event-toggle {
  border-bottom: 1px solid var(--gray_color);
  padding-bottom: 16px;
  margin-bottom: 16px;
  gap: 8px;
}
</style>
