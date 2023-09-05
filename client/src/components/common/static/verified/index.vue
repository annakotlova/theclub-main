<script setup lang="ts">
import IconCommonCheck from '@icons/common/check.vue';
</script>

<template>
  <div class="verified flex-center">
    <icon-common-check size="10px"></icon-common-check>
  </div>
</template>

<style scoped lang="scss">
.verified {
  $px: 12px;
  width: $px;
  height: $px;
  border-radius: $px;
  background-color: var(--blue_color);
}
</style>
