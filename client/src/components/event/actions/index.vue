<script setup lang="ts">
import IconEventPagination from '@icons/event/pagination.vue';

const emit = defineEmits<{
  (e: 'pagination'): void;
}>();
</script>

<template>
  <div class="event-actions flex-column flex-center">
    <button class="btn btn-main" @click="emit('pagination')">Показать еще</button>
    <div class="flex flex-is">
      <span class="fz24">А вдруг там что-то максимально</span>
      <IconEventPagination></IconEventPagination>
    </div>
  </div>
</template>

<style scoped lang="scss">
.event-actions {
  gap: 24px;
  button {
    border-radius: 16px;
    font-size: 32px;
    padding: 24px 48px;
  }
  > div {
    gap: 12px;
  }
}

@media (max-width: 720px) {
  .event-actions {
    button {
      width: 100%;
      padding: 16px 32px;
      font-size: 24px;
    }
    > div {
      display: none;
    }
  }
}
</style>
