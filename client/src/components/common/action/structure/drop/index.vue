<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue';
import { StructureProps } from '@/interfaces/common/structure.dto';

import IconArrowDown from '@icons/arrow/down.vue';

const emit = defineEmits(['dropHandler', 'dropManipulation']);
const props = defineProps<{
  input: StructureProps['input'];
  data: StructureProps['data'];
}>();

const isSingleDrop = props.input.type.includes('single');
if (!isSingleDrop && !props.data[props.input.id]?.length) props.data[props.input.id] = [];

const dropHandler = () => {
  emit('dropHandler');
  props.input.drop_show = !props.input.drop_show;
};

const destroyHandler = () => {
  props.input.drop_show = false;
};

const dropElementHandler = (element: { _id: string; name: string }) => {
  const id = props.input.id;

  if (isSingleDrop) {
    props.data[id] = element._id;
    props.input.drop_show = false;
    emit('dropManipulation');
    return;
  }

  if (props.data[id].includes(element._id)) {
    props.data[id] = props.data[id].filter((el: string) => el !== element._id);
    emit('dropManipulation');
    return;
  }

  props.data[id] = [...props.data[id], element._id];
  emit('dropManipulation');
};

const currentName = computed(() => {
  if (isSingleDrop)
    return props.input.drop_enum[props.data[props.input.id]] || props.input.placeholder;
  const list = (props.data[props.input.id] || [])
    .map((el: string) => props.input.drop_enum[el])
    .join(', ');
  return list || props.input.placeholder;
});

const keyHandler = (event: KeyboardEvent) => {
  if (event.key === 'Escape') destroyHandler();
};

const clickHandler = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const isClosest = target.closest(`[data-drop="${props.input.id}"]`);
  if (!isClosest) destroyHandler();
};

onMounted(() => {
  const modal = document.querySelector('.overlay--modal') as HTMLDivElement;
  modal?.addEventListener('click', clickHandler);

  document.addEventListener('keydown', keyHandler);
});

onUnmounted(() => {
  const modal = document.querySelector('.overlay--modal') as HTMLDivElement;
  modal?.removeEventListener('click', clickHandler);

  document.removeEventListener('keydown', keyHandler);
});
</script>

<template>
  <div class="modal-drop cursor-pointer" :data-drop="input.id">
    <div class="common-input--name">{{ input.name }}</div>
    <div
      class="modal-drop--container fz16 flex-center-between cursor-pointer"
      :class="{ error: props.input.error, selected: input.drop_show }"
      @click="dropHandler"
    >
      <span class="text text-1" :class="{ gray: currentName === input.placeholder }">
        {{ currentName }}
      </span>
      <icon-arrow-down size="24px" :class="{ selected: input.drop_show }"></icon-arrow-down>
    </div>
    <transition name="fade">
      <ul v-if="input.drop_show && input.drop" class="modal-drop--drop flex-column fw300">
        <li v-for="element of input.drop" :key="element._id">
          <label class="flex flex-ic">
            <input
              v-if="isSingleDrop"
              type="radio"
              :name="input.id"
              :checked="data[input.id] === element._id"
              @change="dropElementHandler(element)"
            />
            <input
              v-else
              type="checkbox"
              :checked="data[input.id].includes(element._id)"
              @change="dropElementHandler(element)"
            />
            <span class="text text-1">{{ element.name }}</span>
          </label>
        </li>
      </ul>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.modal-drop {
  position: relative;
  &--container {
    background-color: var(--black_color);
    border: 1px solid var(--border_color);
    border-radius: 12px;
    padding: 13px 16px 12px;;
    transition: 0.3s all;
    img {
      transition: 0.3s all;
      &.selected {
        transform: rotate(180deg);
        transition: 0.3s all;
      }
    }
    &.selected {
      transition: 0.3s all;
      border-radius: 8px 8px 0 0;
    }
  }
  &--drop {
    border-top: 1px solid var(--block_color);
    border-radius: 0 0 8px 8px;
    padding: 12px;
    background-color: var(--black_color);
    gap: 12px;
    z-index: 2;
    position: absolute;
    top: 82px;
    left: 0;
    width: 100%;
    max-height: 150px;
    overflow: auto;
    li > label {
      gap: 8px;
      input {
        margin: 0;
      }
      span {
        color: var(--white_color);
      }
    }
  }
}
</style>
