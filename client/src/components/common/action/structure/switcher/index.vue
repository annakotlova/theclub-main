<script setup lang="ts">
import { StructureProps } from '@/interfaces/common/structure.dto';

import Switcher from '@action/input/Switcher.vue';

const emit = defineEmits<{
  (e: 'toggleSwitcher'): void;
}>();

const props = defineProps<{
  input: StructureProps['input'];
  data: StructureProps['data'];
}>();
if (!props.data[props.input.id]) props.data[props.input.id] = false;
</script>

<template>
  <div class="modal-switcher">
    <div class="common-input--name flex flex-ic">
      <span class="yellow">{{ input.name }}</span>
    </div>
    <switcher v-model="data[input.id]" :id="input.id" @change="emit('toggleSwitcher')"></switcher>
  </div>
</template>
