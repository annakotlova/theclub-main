<script setup lang="ts">
import { ref } from 'vue';
import { TableOptions } from '@/interfaces/table/table.dto';

import ContainerBodyElement from './ContainerBodyElement.vue';
import ContainerBodyActions from './ContainerBodyActions.vue';

const emit = defineEmits(['scrollEvent']);
defineProps<{
  options: TableOptions;
  data: Array<Record<string, any>>;
}>();

const scroll = ref<HTMLElement | null>(null);
</script>

<template>
  <div class="table--body" v-if="!!data.length" ref="scroll" @scroll="emit('scrollEvent', scroll)">
    <transition-group name="fade">
      <div
        class="table--body-tr flex"
        v-for="(row, index) of data"
        :key="row._id"
        :class="{ cursor: options.actions?.click }"
      >
        <container-body-element
          v-for="variable of options.elements.filter((el: any) => el.id)"
          :key="variable.id"
          :variable="variable.id"
          :width="variable.width"
          :element="row"
          :table="options.id"
          :index="index"
        ></container-body-element>
        <container-body-actions
          v-if="options.actions?.table"
          :options="options"
          :row="row"
        ></container-body-actions>
      </div>
    </transition-group>
  </div>
  <div v-else class="table--body">
    <div class="table--body-tr">
      <div class="table--body-td" colspan="3">
        <span class="fz16">{{ options.empty }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.table--body {
  overflow-y: auto;
  overflow-x: hidden;
  &-tr {
    .table--body-td {
      font-weight: 400;
      padding: 12px;
      vertical-align: middle;
    }
    &:not(:last-child) {
      .table--body-td {
        border-bottom: 1px solid rgba(64, 64, 64, 0.35);
      }
    }
  }
}
</style>
