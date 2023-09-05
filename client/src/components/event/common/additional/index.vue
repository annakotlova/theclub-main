<script setup lang="ts">
defineProps<{
  additional: string;
}>();
</script>

<template>
  <div class="event-common-additional">
    <div class="title gray">Дополнительно:</div>
    <div class="container">{{ additional }}</div>
  </div>
</template>

<style scoped lang="scss">
.event-common-additional {
  white-space: pre-line;
  border-top: 1px solid var(--darkborder_color);
  margin-top: 8px;
  .title {
    margin: 12px 0 8px;
  }
}
</style>
