<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { mask as vMask } from 'vue-the-mask';
import { StructureProps } from '@/interfaces/common/structure.dto';
import { masks } from './masks';

import Media from '@/plugins/media/index.vue';

const props = defineProps<{
  input: StructureProps['input'];
  data: StructureProps['data'];
}>();

const selectedCode = ref('RUS');
const showList = ref(false);

const code = props.data[props.input.id].split('(').shift();
props.data[props.input.id + '_code'] = code || '+7';

const currentCode = computed(() => {
  return masks[selectedCode.value as 'RUS'];
});

const currentCodeImage = computed(() => {
  return `/images/countries/${selectedCode.value}.svg`;
});

const currentCodePlaceholder = computed(() => {
  return currentCode.value.mask.replaceAll('#', '9');
});

const selectCode = function (code: string, reset = false) {
  selectedCode.value = code;
  showList.value = false;
  props.data[props.input.id + '_code'] = currentCode.value.code;
  if (reset) props.data[props.input.id] = '';
};

const detectPhone = function () {
  if (!props.data[props.input.id]) return;
  const phone_code = props.data[props.input.id].split('(')[0];
  if (!phone_code) return;

  const current_code_index = Object.values(masks).findIndex((mask) => mask.code === phone_code);
  if (current_code_index === -1) return;

  const current_code_name = Object.keys(masks)[current_code_index];
  const current_code = masks[current_code_name as keyof typeof masks];

  props.data[props.input.id] = props.data[props.input.id].replace(current_code.code, '');
  selectCode(current_code_name);
};
detectPhone();

const updatePhone = () => {
  const phone = props.data[props.input.id];
  const regex = currentCode.value.mask
    .replaceAll('#', '\\d')
    .replaceAll('-', '\\-')
    .replaceAll('(', '\\(')
    .replaceAll(')', '\\)');

  const test = phone.match(regex);
  if (!test) return;
};

const clickHandler = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  const isClosest = target.closest(`.common-phone`);
  if (!isClosest) showList.value = false;
};

onMounted(() => {
  const modal = document.querySelector('.overlay--modal') as HTMLDivElement;
  modal?.addEventListener('click', clickHandler);

  document.querySelector('body')?.addEventListener('click', clickHandler);
});

onUnmounted(() => {
  const modal = document.querySelector('.overlay--modal') as HTMLDivElement;
  modal?.removeEventListener('click', clickHandler);

  document.querySelector('body')?.addEventListener('click', clickHandler);
});
</script>

<template>
  <div class="common-phone">
    <div class="common-input--name">Номер телефона</div>
    <div class="common-phone--container flex flex-ic">
      <div class="code flex-center cursor-pointer" @click="showList = !showList">
        <div class="code--img">
          <media :image="currentCodeImage"></media>
        </div>
        <div class="code--value">{{ currentCode.code }}</div>
      </div>
      <transition name="fade">
        <div v-if="showList" class="code--list flex-column common-block">
          <div
            class="element cursor-pointer flex flex-ic fz14"
            v-for="(code, name) in masks"
            :key="name"
            @click="selectCode(name, true)"
          >
            <div class="element--img">
              <media :image="`/images/countries/${name}.svg`"></media>
            </div>
            <div class="element--name">{{ code.name }}</div>
          </div>
        </div>
      </transition>
      <input
        type="text"
        v-model="data[input.id]"
        v-mask="currentCode.mask"
        :placeholder="currentCodePlaceholder"
        @blur="updatePhone"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.common-phone {
  border-radius: 12px;
  &--container {
    position: relative;
    border-radius: 8px;
    background-color: var(--block_color);
    padding: 10px 16px;
    gap: 2px;
    .code {
      gap: 6px;
      &--img {
        border-radius: 4px;
        width: 18px;
        height: 18px;
        img {
          width: inherit;
          height: inherit;
        }
      }
      &--list {
        position: absolute;
        top: 50px;
        left: 0px;
        z-index: 2;
        gap: 8px;
        background-color: var(--block_color);
        border-radius: 8px;
        max-height: 150px;
        overflow: auto;
        padding: 8px 12px;
        .element {
          gap: 10px;
          padding-bottom: 8px;
          &--img {
            border-radius: 4px;
            width: 20px;
            height: 20px;
            img {
              width: inherit;
              height: inherit;
            }
          }
          &:not(:last-child) {
            border-bottom: 1px solid var(--border_color);
          }
        }
      }
    }
    input {
      width: 100%;
      font-size: 14px;
      flex: 1 1 auto;
      border: none;
      background-color: transparent;
      color: var(--white_color);
    }
  }
}
</style>
