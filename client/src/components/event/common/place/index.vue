<script setup lang="ts">
import IconCommonPlace from '@icons/common/place.vue';

defineProps<{
  place: string;
}>();
</script>

<template>
  <div class="event-common-place flex flex-ic">
    <icon-common-place size="18px" class-list="yellow_filter"></icon-common-place>
    <span>{{ place || 'Уточняется' }}</span>
  </div>
</template>

<style scoped lang="scss">
.event-common-place {
  gap: 12px;
}
</style>
