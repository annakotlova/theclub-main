<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

import IconPen from '@icons/common/pen.vue';
import CommonDrop from '@action/drop/index.vue';
const EditContainer = defineAsyncComponent(() => import('./container/index.vue'));

const emit = defineEmits<{
  (e: 'action', id: string, data: Record<string, any>): void;
}>();
</script>

<template>
  <div class="edit black">
    <common-drop element=".info-main .edit" :container="{ top: '-8px', right: '-8px' }">
      <template #header="{ show }">
        <div class="edit-header flex-center cursor-pointer" :class="{ show }">
          <icon-pen :class-list="show ? 'yellow_filter' : 'black_filter'" size="14px"></icon-pen>
        </div>
      </template>
      <template #container>
        <edit-container
          @action="(action: string, data: any) => emit('action', action, data)"
        ></edit-container>
      </template>
    </common-drop>
  </div>
</template>

<style scoped lang="scss">
.edit {
  top: 0;
  right: 0;
  position: absolute;
  &-header {
    top: 0;
    right: 0;
    $px: 32px;
    width: $px;
    height: $px;
    position: absolute;
    border-radius: $px;
    transition: 0.2s all;
    background-color: var(--yellow_color);
    z-index: 10;
    &.show {
      transition: 0.2s all;
      background-color: var(--black_color);
    }
  }
}
</style>
