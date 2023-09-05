<script setup lang="ts">
import { useModalStore } from '@/store/modal';
import { TableOptions } from '@/interfaces/table/table.dto';

defineProps<{
  options: TableOptions;
  row: Record<string, any>;
}>();

const modal = useModalStore().create;
</script>

<template>
  <div
    class="table--body-td actions"
    :style="`width: ${options.elements[options.elements.length - 1].width}`"
  >
    <div class="flex-center-end">
      <div
        v-if="options.actions?.table?.edit"
        class="icon icon-update cursor-pointer flex-center"
        @click.stop="modal({ id: `${options.id}-update`, data: row })"
      >
        <span>UPDATE</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.actions {
  position: relative;
  text-align: right;
  div {
    gap: 8px;
    &.icon {
      $px: 24px;
      width: $px;
      height: $px;
      border-radius: $px;
      svg {
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>
