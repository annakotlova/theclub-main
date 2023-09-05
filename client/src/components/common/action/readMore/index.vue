<script setup lang="ts">
import { reactive } from 'vue';

const props = defineProps<{
  length: number;
  text: string;
}>();

const state = reactive({
  show: false,
});
</script>

<template>
  <div class="read">
    <div class="read-text">
      <span>{{ text.slice(0, props.length) }}</span>
      <template v-if="text.slice(length)">
        <span v-if="!state.show">...</span>
        <span v-else>{{ text.slice(length) }}</span>
        <span class="yellow cursor-pointer" @click="state.show = !state.show">
          {{ state.show ? ' Скрыть' : ' Читать далее' }}
        </span>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.read {
  word-break: break-word;
  white-space: pre-line;
  &-more {
    margin-top: 6px;
  }
}
</style>
