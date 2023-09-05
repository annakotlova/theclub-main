<script setup lang="ts">
import ReadMore from '@action/readMore/index.vue';

defineProps<{
  about: string;
}>();
</script>

<template>
  <div>
    <read-more v-if="about" :length="150" :text="about"></read-more>
    <div v-else class="about gray">Не указано</div>
  </div>
</template>

<style scoped lang="scss">
div {
  .about {
    white-space: pre-line;
  }
}
</style>
