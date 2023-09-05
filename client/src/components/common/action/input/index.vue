<script setup lang="ts">
import { mask as vMask } from 'vue-the-mask';

const model = defineModel<string>();

defineProps<{
  type: 'textarea' | 'input' | 'div';
  placeholder?: string;
  className?: string;
  mask?: string;
}>();
</script>

<template>
  <textarea
    v-if="type === 'textarea'"
    :class="className"
    :placeholder="placeholder || ''"
    v-model="model"
  ></textarea>
  <input
    v-else-if="type === 'input' && mask"
    v-mask="mask"
    :class="className"
    :placeholder="placeholder || ''"
    v-model="model"
  />
  <input
    v-else-if="type === 'input'"
    :class="className"
    :placeholder="placeholder || ''"
    v-model="model"
  />
  <div class="input" :class="className" v-else>{{ model }}</div>
</template>

<style scoped lang="scss">
@import './input.scss';
</style>
