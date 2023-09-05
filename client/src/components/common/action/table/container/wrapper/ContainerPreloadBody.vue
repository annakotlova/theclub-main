<script setup lang="ts">
import { TableElement } from '@/interfaces/table/table.dto';

defineProps<{
  elements: Array<TableElement>;
  limit: number;
}>();
</script>

<template>
  <div class="table--body">
    <div class="table--body-tr flex" v-for="row of limit" :key="row">
      <div
        class="table--body-td"
        v-for="element of elements"
        :key="element.id"
        :style="`width: ${element.width}`"
      >
        <div class="preloader"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@keyframes pulsate {
  50% {
    background-color: var(--block_color);
  }
}

.table--body {
  &-td {
    flex: 1 1 auto;
    padding: 12px;
    .preloader {
      width: 80%;
      height: 12px;
      border-radius: 10px;
      background-color: var(--black_color);
      animation: pulsate 3s ease infinite;
    }
  }
}
</style>
