<script setup lang="ts">
import InfoMain from './main/index.vue';
import InfoAdditional from './additional/index.vue';

defineProps<{
  isMobile?: boolean;
}>();
</script>

<template>
  <div class="profile-info flex-column" :class="{ mobile: isMobile }">
    <info-main v-if="!isMobile"></info-main>
    <info-additional></info-additional>
  </div>
</template>

<style scoped lang="scss">
.profile-info {
  z-index: 2;
  gap: 24px;
  &.mobile {
    gap: 16px;
  }
}
</style>
