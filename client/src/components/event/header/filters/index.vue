<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { EventFilters } from '@/interfaces/event/event.dto';

import CommonDrop from '@action/drop/index.vue';
import FiltersHeader from './header/index.vue';
const FiltersContainer = defineAsyncComponent(() => import('./container/index.vue'));

const emit = defineEmits<{
  (e: 'submitFilters', data: EventFilters): void;
}>();
</script>

<template>
  <div class="filters">
    <common-drop element=".filters" :container="{ top: '60px', left: '0' }">
      <template #header="{ show }">
        <filters-header :show="show"></filters-header>
      </template>
      <template #container="{ toggle }">
        <filters-container @submit="(o) => { toggle(false); emit('submitFilters', o) }"></filters-container>
      </template>
    </common-drop>
  </div>
</template>

<style scoped lang="scss"></style>
