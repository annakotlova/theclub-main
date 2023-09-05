<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { TableElementFilter } from '@/interfaces/table/table.dto';
import tableAPI from '@/api/table';

const FilterSelect = defineAsyncComponent(() => import('./type/Select.vue'));
const IconTableMin = defineAsyncComponent(() => import('@icons/table/min.vue'));
const IconTableMax = defineAsyncComponent(() => import('@icons/table/max.vue'));

const emit = defineEmits(['generateQueryFilters']);

const props = defineProps<{
  filter: TableElementFilter;
}>();

const isMinType = computed(() => props.filter.type === 'minmax' && props.filter.value !== '-1');
const isMaxType = computed(() => props.filter.type === 'minmax' && props.filter.value === '-1');
const isSelectType = computed(() => ['select', 'checkbox'].includes(props.filter.type));

const initialData = async () => {
  const { data } = await tableAPI.getFilterList(props.filter.request as string);
  for (const element of data) element.selected = false;
  props.filter.list = data;
};

const selectFilterAction = (value: string | number) => {
  props.filter.value = value;
  emit('generateQueryFilters');
};

const toggleMinMax = () => {
  selectFilterAction(props.filter.value === '1' ? '-1' : '1');
};

if (props.filter.request) initialData();
</script>

<template>
  <div class="filter cursor-pointer" :data-drop="filter.id">
    <icon-table-min v-if="isMinType" @click="toggleMinMax"></icon-table-min>
    <icon-table-max v-if="isMaxType" @click="toggleMinMax"></icon-table-max>
    <filter-select
      v-if="isSelectType"
      :filter="filter"
      @select-filter-action="selectFilterAction"
    ></filter-select>
  </div>
</template>

<style scoped lang="scss">
.filter {
  width: 14px;
  height: 14px;
}
</style>
