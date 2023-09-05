<script setup lang="ts">
import { getNavigation } from '@/utils/enums/navigation';
import { Navigation } from '@/interfaces/common/navigation.dto';

import Route from './element/index.vue';

const emit = defineEmits<{
  (e: 'routing', item: Navigation): void;
}>();

const navigation = [getNavigation('main'), getNavigation('additional')];
</script>

<template>
  <nav class="navigation-container">
    <ul v-for="(list, index) of navigation" :key="index" class="flex-column">
      <route
        v-for="item of list"
        :key="item.id"
        :route="item"
        @routing="emit('routing', item)"
      ></route>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.navigation-container {
  width: 240px;
  border: 1px solid var(--black_color);
  padding: 24px;
  border-radius: 0 0 16px 16px;
  background-color: var(--black_opacity_color);
  ul {
    gap: 20px;
    &:first-child {
      padding-bottom: 16px;
      margin-bottom: 16px;
      border-bottom: 1px solid var(--darkborder_color);
    }
  }
}
</style>
