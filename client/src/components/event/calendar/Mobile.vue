<script setup lang="ts">
import { onMounted, onUnmounted, reactive } from 'vue';

import EventCalendar from './index.vue';
import IconCommonCancel from '@icons/common/cancel.vue';
import IconCommonCalendar from '@icons/common/calendar.vue';

const state = reactive({
  show: false,
});

const clickHandler = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const isClosest = target.closest(`.eventMobile`);
  if (!isClosest && !Array.from(target.classList).includes('next-date')) state.show = false;
};

onMounted(() => {
  document.addEventListener('click', clickHandler);
});

onUnmounted(() => {
  document.removeEventListener('click', clickHandler);
});
</script>

<template>
  <div class="eventMobile">
    <div
      class="eventMobile-header flex flex-ic cursor-pointer"
      :class="{ show: state.show }"
      @click="state.show = !state.show"
    >
      <div class="eventMobile-header--icon">
        <transition-group name="scale">
          <icon-common-cancel v-if="state.show" size="20px"></icon-common-cancel>
          <icon-common-calendar v-else class="black_filter" size="20px"></icon-common-calendar>
        </transition-group>
      </div>
    </div>
    <transition name="scale">
      <div v-if="state.show" class="eventMobile-container">
        <event-calendar :drop="true" @select-event="state.show = false"></event-calendar>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.eventMobile {
  position: relative;
  &-header {
    background-color: var(--yellow_color);
    transition: 0.3s all;
    border-radius: 12px;
    padding: 10px;
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
    &.show {
      transition: 0.3s all;
      background-color: var(--yellow_color);
    }
  }
  &-container {
    top: 125%;
    left: -53px;
    position: absolute;
    z-index: 1;
  }
}
</style>
