<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive } from 'vue';

const { element, container } = defineProps<{
  element: string;
  container: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    'z-index'?: number;
    maxHeight?: string;
  };
}>();

const state = reactive({
  show: false,
});

const containerStyle = computed(() => ({
  top: container.top,
  left: container.left,
  right: container.right,
  bottom: container.bottom,
  'z-index': container['z-index'] || 9,
  'max-height': container.maxHeight,
}));

const clickHandler = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const isClosest = target.closest(element);
  if (!isClosest) state.show = false;
};

const toggle = (status?: boolean) => {
  state.show = status || !state.show;
};

onMounted(() => {
  document.addEventListener('click', clickHandler);
});

onUnmounted(() => {
  document.removeEventListener('click', clickHandler);
});
</script>

<template>
  <div class="drop">
    <div class="drop-header" @click="state.show = !state.show">
      <slot name="header" :show="state.show"></slot>
    </div>
    <transition name="fade">
      <div v-if="state.show" class="drop-container" :style="containerStyle">
        <slot name="container" :toggle="toggle" :show="state.show"></slot>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.drop {
  position: relative;
  &-container {
    position: absolute;
  }
}
</style>
