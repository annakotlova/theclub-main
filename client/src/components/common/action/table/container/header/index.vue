<script setup lang="ts">
import { TableElement, TableElementFilter } from '@/interfaces/table/table.dto';

import HeaderElement from './Element.vue';

const emit = defineEmits(['queryFilters']);

const props = defineProps<{
  elements: Array<TableElement>;
  query: Record<string, any>;
  id: string;
}>();

const generateQueryFilters = () => {
  const filterList = Object.values(props.elements)
    .reduce((acc: Array<TableElementFilter>, e) => acc.concat(e.filter as TableElementFilter), [])
    .filter((f: Record<string, any>) => f?.value !== undefined);

  const query = {} as Record<string, any>;
  for (const filter of filterList) query[filter.id] = filter.value;
  emit('queryFilters', query);
};
</script>

<template>
  <div class="table--header flex">
    <header-element
      v-for="element of elements"
      :key="element.id"
      :element="element"
      @generate-query-filters="generateQueryFilters"
    ></header-element>
  </div>
</template>
