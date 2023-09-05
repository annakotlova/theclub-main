<script lang="ts">
import { defineComponent } from 'vue';
import { useRoute } from 'vue-router';

export default defineComponent({
  name: 'auth-layout',
  inheritAttrs: false,
  customOptions: {},
});
</script>

<script setup lang="ts">
import CommonMarquee from '@page/marquee/index.vue';
import { MarqueeAuthWords as words } from '@/utils/enums/auth';

const route = useRoute();
</script>

<template>
  <section class="page flex-column">
    <common-marquee :top="true" :word="words[route.meta.id as keyof typeof words]"></common-marquee>
    <div class="page-main flex-center">
      <router-view></router-view>
    </div>
    <common-marquee :word="words[route.meta.id as keyof typeof words]"></common-marquee>
  </section>
</template>

<style scoped lang="scss">
.page {
  padding: 24px 0;
  &-main {
    flex: 1 1 auto;
    > section {
      width: 480px;
      background-color: var(--black_color);
      border-radius: 24px;
      padding: 32px;
    }
  }
}

@media (max-height: 840px) {
  .page {
    padding: 0;
    &-main {
      padding: 16px;
    }
  }
}

@media (max-width: 600px) {
  .page {
    &-main {
      > section {
        width: 100%;
        padding: 24px;
      }
    }
  }
}
</style>
