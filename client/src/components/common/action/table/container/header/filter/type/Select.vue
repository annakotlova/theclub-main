<script setup lang="ts">
import { reactive, defineAsyncComponent, onMounted, onUnmounted } from 'vue';
import { TableElementFilter } from '@/interfaces/table/table.dto';

import IconArrowDown from '@icons/arrow/down.vue';
const CommonInputType = defineAsyncComponent(() => import('@action/input/Type.vue'));

const emit = defineEmits(['selectFilterAction']);
const { filter } = defineProps<{
  filter: TableElementFilter;
}>();

const state = reactive({
  show: false,
});

const selectedMap = () => {
  const list = (filter.list as Array<{ _id: string; selected: boolean }>)
    .filter((e) => e.selected)
    .map((e) => e._id);
  selectElement(list);
};

const selectElement = (value: string | string[]) => {
  if (filter.type === 'select') state.show = false;
  emit('selectFilterAction', value);
};

const clickHandler = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const isClosest = target.closest(`[data-drop="${filter.id}"]`);
  if (!isClosest) state.show = false;
};

onMounted(() => {
  document.addEventListener('click', clickHandler);
});

onUnmounted(() => {
  document.addEventListener('click', clickHandler);
});
</script>

<template>
  <div @click="state.show = !state.show">
    <icon-arrow-down :class="{ active: state.show }"></icon-arrow-down>
    <transition name="scale">
      <div v-if="state.show && filter.list" class="drop" @click.stop>
        <ul v-if="filter.type === 'select'">
          <li
            class="fw500 fz12"
            v-for="element of filter.list"
            :key="element._id"
            :class="{ selected: element._id === filter.value }"
            @click="selectElement(element._id)"
          >
            {{ element.name }}
          </li>
        </ul>
        <ul v-else-if="filter.type === 'checkbox'">
          <li
            class="flex flex-ic fw500 fz12"
            v-for="element of filter.list"
            :key="element._id"
            :class="{ selected: element._id === filter.value }"
          >
            <common-input-type
              type="checkbox"
              v-model="element.selected"
              @change="selectedMap"
            ></common-input-type>
            <span class="text text-1">{{ element.name }}</span>
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
div {
  svg {
    width: 14px;
    height: 14px;
    transition: 0.3s transform;
    &.active {
      transition: 0.3s transform;
      transform: rotate(180deg);
    }
  }
  .drop {
    background-color: var(--block_color);
    min-width: 90%;
    position: absolute;
    top: 90%;
    left: 24px;
    padding: 12px 8px;
    max-height: 150px;
    overflow: auto;
    ul {
      li {
        gap: 10px;
        padding: 8px 10px;
        transition: 0.3s all;
        &:hover {
          transition: 0.3s all;
          background-color: var(--lightblock_color);
        }
        &.selected {
          color: var(--white_color);
        }
      }
    }
  }
}
</style>
