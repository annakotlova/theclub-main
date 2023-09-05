<script setup lang="ts">
defineProps<{
  title: string;
  type: string;
}>();
</script>

<template>
  <div class="modal--title flex-column">
    <div class="title fz18 fw500">{{ title }}</div>
  </div>
</template>

<style scoped lang="scss">
.modal--title {
  gap: 16px;
  margin-bottom: 12px;
}
</style>
