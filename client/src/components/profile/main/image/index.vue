<script setup lang="ts">
import image from '@/assets/images/profile.webp';

import Media from '@/plugins/media/index.vue';
</script>

<template>
  <section class="profile-image">
    <media :image="image"></media>
  </section>
</template>

<style scoped lang="scss">
.profile-image {
  position: absolute;
  z-index: 1;
  width: 220px;
  top: -80px;
  left: -40px;
}
</style>