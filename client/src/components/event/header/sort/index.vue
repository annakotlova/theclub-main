<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { EventSort } from '@/interfaces/event/event.dto';

import SortHeader from './header/index.vue';
import CommonDrop from '@action/drop/index.vue';
const SortContainer = defineAsyncComponent(() => import('./container/index.vue'));

const emit = defineEmits<{
  (e: 'submitSort', data: EventSort): void;
}>();

const submit = (sort: EventSort) => {
  emit('submitSort', sort);
};
</script>

<template>
  <div class="sort">
    <common-drop element=".sort" :container="{ top: '105%', left: '0px' }">
      <template #header="{ show }">
        <sort-header :show="show"></sort-header>
      </template>
      <template #container="{ toggle }">
        <sort-container @submit="(s) => { toggle(false); submit(s) }"></sort-container>
      </template>
    </common-drop>
  </div>
</template>

<style scoped lang="scss"></style>
