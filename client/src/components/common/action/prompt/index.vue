<script setup lang="ts">
import CommonDrop from '@action/drop/index.vue';
import IconPrompt from '@icons/common/prompt.vue';

defineProps<{
  prompt: string;
}>();
</script>

<template>
  <div class="prompt">
    <common-drop element=".prompt" :container="{ top: '20px', right: '0px' }">
      <template #header>
        <div class="prompt-header cursor-pointer">
          <icon-prompt></icon-prompt>
        </div>
      </template>
      <template #container>
        <div class="prompt-container fz12 fw200">{{ prompt }}</div>
      </template>
    </common-drop>
  </div>
</template>

<style scoped lang="scss">
.prompt {
  &-header {
    height: 14px;
    position: relative;
    img {
      position: static;
    }
  }
  &-container {
    width: 280px;
    padding: 12px;
    border-radius: 8px;
    background-color: var(--black_color);
    border: 1px solid var(--yellow_hover);
  }
}
</style>
