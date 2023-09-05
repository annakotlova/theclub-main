<script setup lang="ts">
import { computed, reactive } from 'vue';
import { StructureProps } from '@/interfaces/common/structure.dto';

import IconEyeOpen from '@icons/eye/open.vue';
import IconEyeClose from '@icons/eye/close.vue';

const emit = defineEmits<{
  (e: 'dataManipulation'): void;
}>();

const props = defineProps<{
  input: StructureProps['input'];
  data: StructureProps['data'];
  className?: string;
}>();

const state = reactive({
  show: false,
});

const classList = computed(() => {
  return { error: props.input.error };
});
</script>

<template>
  <div class="common-input modal-password" :style="`grid-column: ${input.grid}`">
    <div v-if="input.name" class="common-input--name" :class="className">
      <span class="fz16">{{ input.name }}</span>
    </div>
    <div class="common-input--wrap">
      <input
        v-model="data[input.id]"
        :type="state.show ? 'text' : 'password'"
        :class="[classList, className]"
        :placeholder="input.placeholder"
        @keyup="emit('dataManipulation')"
      />
      <transition name="scale">
        <icon-eye-open
          v-if="!state.show"
          class="cursor-pointer"
          @click="state.show = true"
        ></icon-eye-open>
        <icon-eye-close v-else class="cursor-pointer" @click="state.show = false"></icon-eye-close>
      </transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../../input/input.scss';

.common-input {
  &--wrap {
    position: relative;
  }
}

.modal-password {
  img {
    position: absolute;
    right: 12px;
    bottom: 10px;
    left: unset;
  }
}
</style>
