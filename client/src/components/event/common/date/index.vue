<script setup lang="ts">
import dateFilter from '@/filters/date.filter';

import IconCommonCalendar from '@icons/common/calendar.vue';

defineProps<{
  startedAt: string | Date;
  endedAt: string | Date;
}>();
</script>

<template>
  <div class="event-common-date flex flex-ic">
    <icon-common-calendar size="18px" class-list="yellow_filter"></icon-common-calendar>
    <span>{{ dateFilter(startedAt, 'datetime') }}</span>
  </div>
</template>

<style scoped lang="scss">
.event-common-date {
  gap: 12px;
}
</style>
