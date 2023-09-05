<script setup lang="ts">
import { defineAsyncComponent, reactive } from 'vue';
import { TableElement } from '@/interfaces/table/table.dto';

const HeaderFilter = defineAsyncComponent(() => import('./filter/index.vue'));

const emit = defineEmits(['generateQueryFilters']);

const props = defineProps<{
  element: TableElement;
}>();

const state = reactive({
  filter: props.element.filter,
});

const generateQueryFilters = () => {
  props.element.filter = state.filter;
  emit('generateQueryFilters');
};
</script>

<template>
  <div class="table--header-element fw300 fz12" :style="`width: ${element.width}`">
    <div class="th flex flex-ic gray">
      <span>{{ element.name }}</span>
      <header-filter
        v-if="state.filter"
        :filter="state.filter"
        @generate-query-filters="generateQueryFilters"
      ></header-filter>
    </div>
  </div>
</template>

<style scoped lang="scss">
.table--header-element {
  line-height: 12px;
  text-align: left;
  padding: 12px;
  padding-bottom: 12px;
  letter-spacing: 0.03em;
  position: relative;
  border-bottom: 1px solid rgba(64, 64, 64, 0.35);
  .th {
    gap: 10px;
  }
}
</style>
