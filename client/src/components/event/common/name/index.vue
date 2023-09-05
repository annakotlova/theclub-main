<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const IconCrown = defineAsyncComponent(() => import('@icons/common/crown.vue'));

defineProps<{
  name: string;
  isClub: boolean;
}>();
</script>

<template>
  <div class="event-common-name flex flex-ic fz26 fw600">
    <div class="text text-3">{{ name }}</div>
    <icon-crown v-if="isClub" size="24px"></icon-crown>
  </div>
</template>

<style scoped lang="scss">
.event-common-name {
  gap: 16px;
}
</style>
