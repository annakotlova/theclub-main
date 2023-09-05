<script setup lang="ts">
const model = defineModel<boolean>();

defineProps<{
  type: string;
  name?: string;
}>();
</script>

<template>
  <input :type="type" :name="name || 'default'" v-model="model" />
</template>

<style scoped lang="scss">
@import './input.scss';
$px: 16px;

input[type='checkbox'],
input[type='radio'] {
  background: var(--black_color);
  border: 1px solid var(--pink_color);
  box-sizing: border-box;
  border-radius: 2px;
  position: relative;
  min-width: $px;
  width: $px;
  height: $px;
  color: var(--pink_color);
  appearance: none;
  outline: 0;
  cursor: pointer;
  transition: background 175ms cubic-bezier(0.1, 0.1, 0.25, 0.5);
  margin: 0;
}

input[type='checkbox'].filter {
  background-color: transparent;
  border: 1px solid var(--orange_color);
  border-radius: 4px;
}

input[type='radio'] {
  padding: 0;
  border-radius: 50%;
  border-color: var(--pink_color);
}

input[type='radio']::before {
  position: absolute;
  content: '';
  display: block;
  top: 3px;
  left: 3px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: var(--pink_color);
  opacity: 0;
}

input[type='checkbox']::before {
  position: absolute;
  content: '';
  display: block;
  top: 1px;
  left: 4px;
  width: 4px;
  height: 8px;
  border-style: solid;
  border-color: var(--white_color);
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  opacity: 0;
}

input[type='checkbox']:checked {
  -webkit-transition: 0.3s all;
  transition: 0.3s all;
  background-color: var(--pink_color);
}

input[type='checkbox']:checked.filter {
  background-color: var(--orange_color);
}

input[type='checkbox']:checked::before,
input[type='radio']:checked::before {
  opacity: 1;
}

input[type='checkbox']:checked ~ label::before,
input[type='radio']:checked ~ label::before {
  -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  appearance: none;
  margin: 0;
}

input[type='number'] {
  appearance: textfield;
}
</style>
