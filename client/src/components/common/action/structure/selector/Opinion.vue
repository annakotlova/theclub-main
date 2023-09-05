<script setup lang="ts">
const emit = defineEmits(['selectOpinion']);
defineProps<{
  opinion: { _id: string; name: string };
  selected: boolean;
}>();
</script>

<template>
  <div class="opinion cursor-pointer" :class="{ selected }" @click="emit('selectOpinion')">
    {{ opinion.name }}
  </div>
</template>

<style scoped lang="scss">
.opinion {
  border-radius: 8px;
  padding: 12px 16px;
  background-color: transparent;
  border: 1px solid var(--yellow_color);
  transition: 0.3s all;
  &.selected {
    transition: 0.3s all;
    background-color: var(--yellow_color);
    color: var(--black_color);
  }
}

@media (max-width: 720px) {
  .opinion {
    padding: 8px 12px;
  }
}
</style>
