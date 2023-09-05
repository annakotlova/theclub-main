<script setup lang="ts">
import { computed } from 'vue';
import { MonthNames } from '@/utils/enums/date';

import IconArrowRight from '@icons/arrow/right.vue';

const emit = defineEmits<{
  (e: 'updateMonth', inc: 1 | -1): void;
}>();

const props = defineProps<{
  month: Date;
}>();

const monthName = computed(() => MonthNames[props.month.getMonth()]);
</script>

<template>
  <div class="calendar-header flex-center-between">
    <div class="prev cursor-pointer flex-center" @click="emit('updateMonth', -1)">
      <icon-arrow-right size="24px"></icon-arrow-right>
    </div>
    <div class="month">{{ monthName }}</div>
    <div class="next cursor-pointer flex-center" @click="emit('updateMonth', 1)">
      <icon-arrow-right size="24px"></icon-arrow-right>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
