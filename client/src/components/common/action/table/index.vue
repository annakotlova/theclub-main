<script setup lang="ts">
import { onMounted, onUnmounted, reactive } from 'vue';

import { useEmitter } from '@/use/emitter';
import { updateObject } from '@/utils/global';
import { TableOptions } from '@/interfaces/table/table.dto';
import { CommonQuery } from '@/interfaces/common/index.dto';
import tableAPI from '@/api/table';

import TableContainer from './container/index.vue';

type dynamicsObject = Record<string, any>;

const emitter = useEmitter();

const props = defineProps<{
  options: TableOptions;
  static?: Array<dynamicsObject>;
}>();

const state = reactive({
  pending: false,
  pendingScroll: false,
  data: [] as Array<dynamicsObject>,
  total: 0,
  query: {
    limit: 20,
    page: 1,
  } as CommonQuery,
});

const initialData = async () => {
  if (props.static) return;
  state.pending = true;

  const { data, total } = await tableAPI.getPagination(props.options.request, state.query);

  state.data = data;
  state.total = total || 0;
  state.pending = false;
};

const scrollEvent = async () => {
  if (props.static) return;
  const lastElement = document.querySelectorAll('.table--body-tr:nth-last-of-type(1)')[0];
  const position = lastElement.getBoundingClientRect().y || 901;
  if (position < window.innerHeight && !state.pendingScroll) {
    state.pendingScroll = true;
    state.query.page += 1;

    const { data } = await tableAPI.getPagination(props.options.request, state.query);
    if (data.length === 0) return;

    state.data = [...state.data, ...data];
    state.pendingScroll = false;
  }
};

const tableActionEmitter = ({
  data,
  action,
}: {
  data: dynamicsObject;
  action: 'create' | 'edit' | 'delete';
}) => {
  if (action === 'create') state.data = [data, ...state.data];
  if (action === 'delete') state.data = state.data.filter((e) => e._id !== data._id);
  if (['edit', 'file'].includes(action)) {
    const current = state.data.find((e) => e._id === data._id);
    if (current) updateObject(current, data);
  }
};

const tableSocketAction = ({ data, action }: { data: dynamicsObject; action: string }) => {
  if (action === 'create') state.data = [...state.data, data];
  if (action === 'delete') state.data = state.data.filter((el) => el._id !== data._id);
  if (action === 'update') {
    const current = state.data.find((el) => el._id === data._id);
    if (current) updateObject(current, data);
  }
};

const queryFilters = (query: dynamicsObject) => {
  state.pendingScroll = false;
  state.data = [];
  state.query = { ...state.query, ...query };
  state.query.page = 1;
  initialData();
};

const resetQuery = () => {
  state.pendingScroll = false;
  state.data = [];
  state.query = {
    page: 1,
    limit: 20,
  };
  for (const element of props.options.elements) if (element.filter) element.filter.value = '';
  initialData();
};

onMounted(() => {
  emitter.on('table-action', tableActionEmitter);
  emitter.on('table-socket-action', tableSocketAction);
});

onUnmounted(() => {
  emitter.off('table-action');
  emitter.off('table-socket-action');
});

initialData();
</script>

<template>
  <section class="table flex-column fz12">
    <table-container
      :data="static || state.data"
      :options="options"
      :query="state.query"
      :pending="state.pending"
      @reset-query="resetQuery"
      @scroll-event="scrollEvent"
      @query-filters="queryFilters"
    ></table-container>
  </section>
</template>

<style lang="scss" scoped>
.table {
  gap: 24px;
  z-index: 1;
  position: relative;
  overflow: auto;
  &-header {
    gap: 24px;
  }
}

@media (max-width: 960px) {
  .table {
    &-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }
  }
}
</style>
