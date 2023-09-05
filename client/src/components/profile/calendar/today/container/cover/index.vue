<script setup lang="ts">
import { FileDto } from '@/interfaces/file/file.dto';

import Media from '@/plugins/media/index.vue';

defineProps<{
  cover: FileDto;
}>();
</script>

<template>
  <div class="cover">
    <media :image="cover"></media>
  </div>
</template>

<style scoped lang="scss">
.cover {
  border-radius: 8px;
  aspect-ratio: 1 / 0.33;
}
</style>
