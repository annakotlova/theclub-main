<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useGlobalStore } from '@/store/global';

const IconCommonFilter = defineAsyncComponent(() => import('@icons/common/filter.vue'));
const IconCommonCancel = defineAsyncComponent(() => import('@icons/common/cancel.vue'));

defineProps<{
  show: boolean;
}>();

const global = useGlobalStore();
</script>

<template>
  <div class="filters-header flex flex-ic cursor-pointer black" :class="{ mobile: global.isMobile }">
    <div class="filters-header--icon">
      <transition-group name="scale">
        <icon-common-cancel v-if="show" size="20px"></icon-common-cancel>
        <icon-common-filter v-else size="20px"></icon-common-filter>
      </transition-group>
    </div>
    <span v-if="!global.isMobile">{{ show ? 'Закрыть' : 'Фильтры' }}</span>
  </div>
</template>

<style scoped lang="scss">
.filters-header {
  background-color: var(--yellow_color);
  border-radius: 12px;
  padding: 12px;
  gap: 8px;
  &--icon {
    position: relative;
    $px: 20px;
    width: $px;
    height: $px;
    img {
      position: absolute;
    }
  }
  &.mobile {
    padding: 10px;
  }
}
</style>
