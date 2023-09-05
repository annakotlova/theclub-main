<script setup lang="ts">
import { Ref, defineAsyncComponent, inject } from 'vue';
import { EventSort, EventSortName } from '@/interfaces/event/event.dto';
import { useGlobalStore } from '@/store/global';

const IconCommonSort = defineAsyncComponent(() => import('@icons/common/sort.vue'));
const IconCommonCancel = defineAsyncComponent(() => import('@icons/common/cancel.vue'));

defineProps<{
  show: boolean;
}>();

const sort = inject<Ref<EventSort>>('sort');
const global = useGlobalStore();
</script>

<template>
  <div class="sort-header flex flex-ic cursor-pointer" :class="{ mobile: global.isMobile }">
    <template v-if="!global.isMobile">
      <div class="fw300">Сортировать по:</div>
      <div class="yellow">{{ EventSortName[sort || EventSort.NEAREST] || EventSortName.NEAREST }}</div>
    </template>
    <div v-else class="sort-header--icon">
      <transition-group name="scale">
        <icon-common-cancel v-if="show" size="20px"></icon-common-cancel>
        <icon-common-sort v-else size="20px" class-list="black_filter"></icon-common-sort>
      </transition-group>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sort-header {
  gap: 6px;
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
    background-color: var(--yellow_color);
    padding: 10px;
    border-radius: 12px;
  }
}
</style>
