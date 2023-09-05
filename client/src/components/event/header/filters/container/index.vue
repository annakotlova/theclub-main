<script setup lang="ts">
import { Ref, inject, reactive } from 'vue';
import { EventFilters } from '@/interfaces/event/event.dto';
import { EVENT_FILTER_INPUTS } from '@/utils/input/event';
import { CommonFilter } from '@/interfaces/common/index.dto';
import { objectFilter } from '@/utils/global/object';

import Structure from '@action/structure/index.vue';

const emit = defineEmits<{
  (e: 'submit', data: EventFilters): void;
}>();

const filters = inject<Ref<Record<string, string>>>('filters');
const form = reactive(EVENT_FILTER_INPUTS(filters?.value || {}));

const submit = () => {
  const filter = objectFilter(form.data, (k: string) => k !== 'ALL') as EventFilters;
  emit('submit', filter);
};
const reset = () => {
  const data = form.data as EventFilters;
  for (const filter in form.data) {
    const element = filter as keyof typeof data;
    data[element] = CommonFilter.ALL;
  }
  emit('submit', {} as EventFilters);
};
</script>

<template>
  <div class="filters-container common-drop flex-column">
    <structure :module="form"></structure>
    <div class="actions flex flex-je">
      <button class="btn btn-black btn-small" @click="reset">Сбросить</button>
      <button class="btn btn-main btn-small" @click="submit">Показать</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.filters-container {
  width: 365px;
  gap: 48px;
  background: var(--black_opacity_color);
  border: 1px solid var(--black_color);
  backdrop-filter: blur(5px);
  .actions {
    gap: 12px;
  }
}

@media (max-width: 720px) {
  .filters-container {
    max-width: 314px;
    width: 314px;
    gap: 16px;
    padding: 16px;
  }
}
</style>
