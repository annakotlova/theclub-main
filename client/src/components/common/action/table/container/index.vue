<script setup lang="ts">
import { computed } from 'vue';
import { TableOptions } from '@/interfaces/table/table.dto';
import { CommonQuery } from '@/interfaces/common/index.dto';

import ContainerBody from './wrapper/ContainerBody.vue';
import ContainerHeader from './header/index.vue';
import CommonPreloader from '@/components/common/page/preloader/index.vue';

const emit = defineEmits(['scrollEvent', 'queryFilters', 'resetQuery']);
const props = defineProps<{
  options: TableOptions;
  query: CommonQuery;
  data: Array<Record<string, any>>;
  pending: boolean;
}>();

const isQueryTable = computed(() => {
  return Object.keys(props.query).length >= 4;
});
</script>

<template>
  <div class="table--container">
    <div class="table w100 flex-column">
      <container-header
        :elements="options.elements"
        :query="query"
        :id="options.id"
        @query-filters="(query) => emit('queryFilters', query)"
      ></container-header>
      <div v-if="pending" class="table--preloader flex-column flex-center">
        <common-preloader></common-preloader>
      </div>
      <container-body
        v-else
        :data="data"
        :options="options"
        @scroll-event="emit('scrollEvent')"
      ></container-body>
      <div class="reset cursor-pointer pink fz12" v-if="isQueryTable" @click="emit('resetQuery')">
        Сбросить
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
[light] {
  .table--container {
    background: var(--block_color);
  }
}
.table--container {
  background-color: var(--block_color);
  border: 1px solid var(--block_color);
  border-radius: 10px;
  overflow: auto;
  min-height: 200px;
  flex: 1 1 auto;
  width: v-bind('options.width');
  .reset {
    position: absolute;
    top: 10px;
    right: 10px;
  }
  .table {
    height: 100%;
    min-width: v-bind('options.min_width');
    position: relative;
  }
}
.table--preloader {
  .lds {
    position: relative;
    top: 32px;
  }
}
</style>
