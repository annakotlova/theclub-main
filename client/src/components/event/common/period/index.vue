<script setup lang="ts">
import { wordEndings } from '@/utils/wordEndings';
import { computed } from 'vue';

const { startedAt, endedAt } = defineProps<{
  startedAt: Date | string;
  endedAt: Date | string;
}>();

const period = computed(() => {
  const start = +new Date(startedAt);
  const end = +new Date(endedAt);

  const seconds = (end - start) / 1000;
  const minutes = (seconds / 60) % 60;
  const hours = Math.floor(seconds / 3600);

  return { hours, minutes };
});
</script>

<template>
  <div class="event-common-period gray">
    <div class="flex flex-ic">
      <span>Продолжительность:</span>
      <span v-if="period.hours">{{ period.hours }} {{ wordEndings(period.hours, 'hour') }}</span> 
      <span v-if="period.minutes">{{ period.minutes }} {{ wordEndings(period.minutes, 'minute') }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.event-common-period {
  div {
    gap: 4px;
  }
}

@media (max-width: 960px) {
  .event-common-period {
    font-size: 14px;
  }
}
</style>
