<script setup lang="ts">
const model = defineModel<boolean>();

defineProps<{
  id?: string;
}>();
</script>

<template>
  <div class="switcher">
    <input :id="id || 'switcher'" type="checkbox" name="switcher" v-model="model" />
    <label :for="id || 'switcher'"></label>
  </div>
</template>

<style scoped lang="scss">
input[name='switcher'] {
  display: none;
}
input[name='switcher'] + label {
  cursor: pointer;
  height: 24px;
  padding-left: 46px;
  position: relative;
}
input[name='switcher'] + label::before {
  content: '';
  display: inline-block;
  position: absolute;
  top: -2px;
  left: 0;
  vertical-align: middle;
  padding: 0;
  height: 24px;
  width: 46px;
  border-radius: 40px;
  background-color: var(--block_color);
}
input[name='switcher'] + label::after {
  content: '';
  display: block;
  position: absolute;
  top: 2px;
  left: 4px;
  width: 16px;
  height: 16px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.35);
  box-shadow: 0 3px 3px rgba(140, 140, 140, 0.1);
}
input[name='switcher']:checked + label::after {
  background: #fff;
}
input[name='switcher'] + label::before,
input[name='switcher'] + label::after {
  -webkit-transition: all 0.2s ease-out;
  transition: all 0.2s ease-out;
}
input[name='switcher']:checked + label::after {
  left: 26px;
}
input[name='switcher']:checked + label::before {
  background: var(--main_gradient);
}
</style>
