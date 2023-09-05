<script setup lang="ts">
import CommonTable from '@action/table/index.vue';
import { TransactionTable } from '@/utils/table';

const emit = defineEmits<{
  (e: 'toggleTransaction'): void;
}>();
</script>

<template>
  <div class="transactions">
    <div class="transactions-title flex-center-between">
      <div class="left flex flex-ic">
        <span class="fz20">История операций</span>
      </div>
      <div class="right">
        <span class="link" @click="emit('toggleTransaction')">Назад</span>
      </div>
    </div>
    <div class="transactions-container">
      <common-table :options="TransactionTable"></common-table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.transactions {
  width: 100%;
  height: 100%;
  max-height: 605px;
  &-title {
    margin-bottom: 24px;
    .left {
      gap: 12px;
      .unviewed {
        border-radius: 8px;
        padding: 2px 6px;
        background-color: var(--yellow_color);
      }
    }
  }
  &-container {
    overflow: auto;
    height: calc(100% - 47px);
    > section {
      height: 100%;
    }
  }
}

@media (max-width: 1260px) {
  .transactions {
    &-container {
      height: 400px;
    }
  }
}
</style>
