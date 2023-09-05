<script setup lang="ts">
import IconSearch from '@icons/common/search.vue';
import CommonInput from './index.vue';

const model = defineModel<string>();

const emit = defineEmits<{
  (e: 'clickHandler'): void;
  (e: 'onBlur'): void;
  (e: 'onFocus'): void;
}>();

const { placeholder = 'Поиск' } = defineProps<{
  placeholder?: string;
}>();
</script>

<template>
  <div class="search">
    <icon-search size="24px" @click="emit('clickHandler')"></icon-search>
    <common-input
      type="input"
      class-name="search"
      v-model="model"
      :placeholder="placeholder"
      @keyup.enter="emit('clickHandler')"
      @blur="emit('onBlur')"
      @focus="emit('onFocus')"
    ></common-input>
  </div>
</template>

<style scoped lang="scss">
.search {
  position: relative;
  .icon {
    position: absolute;
    z-index: 1;
    top: 8px;
    left: 12px;
  }
}
</style>
