<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { mask as vMask } from 'vue-the-mask';
import { StructureProps } from '@/interfaces/common/structure.dto';

const CommonPrompt = defineAsyncComponent(() => import('@action/prompt/index.vue'));

const emit = defineEmits<{
  (e: 'dataManipulation'): void;
}>();

const props = defineProps<{
  input: StructureProps['input'];
  data: StructureProps['data'];
  className?: string;
}>();

const classList = computed(() => {
  return { error: props.input.error, icon: !!props.input.icon };
});

const currentDisabledText = () => {
  return props.data[props.input.id] || '--';
};
</script>

<template>
  <div class="common-input flex-column">
    <div v-if="input.name" class="common-input--name flex-center-between" :class="className">
      <span>{{ input.name }}</span>
      <common-prompt v-if="input.prompt" :prompt="(input.prompt as string)"></common-prompt>
    </div>
    <div v-if="input.disabled" class="input modal disabled">{{ currentDisabledText() }}</div>
    <input
      v-else-if="input.mask"
      v-mask="input.mask"
      v-model="data[input.id]"
      :type="input.type"
      :class="[classList, className]"
      :placeholder="input.placeholder"
      :autofocus="!!input.autofocus"
      @keyup="emit('dataManipulation')"
    />
    <textarea
      v-else-if="input.type === 'textarea'"
      v-model="data[input.id]"
      :type="input.type"
      :class="[classList, className]"
      :placeholder="input.placeholder"
      :autofocus="!!input.autofocus"
      @keyup.enter="emit('dataManipulation')"
    />
    <input
      v-else
      v-model="data[input.id]"
      :type="input.type"
      :class="[classList, className]"
      :placeholder="input.placeholder"
      :autofocus="!!input.autofocus"
      @keyup.enter="emit('dataManipulation')"
    />
    <component v-if="input.icon" :is="input.icon" size="24px"></component>
  </div>
</template>

<style scoped lang="scss">
@import '../../input/input.scss';
</style>
