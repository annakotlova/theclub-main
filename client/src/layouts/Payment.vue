<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'payment-layout',
  inheritAttrs: false,
  customOptions: {},
});
</script>

<script setup lang="ts">
import CommonHeader from '@page/header/index.vue';
</script>

<template>
  <section class="page flex-column">
    <common-header></common-header>
    <div class="page-main flex-column flex-center">
      <div class="logotype fw900 black">THE CLUB</div>
      <router-view></router-view>
    </div>
  </section>
</template>

<style scoped lang="scss">
.page {
  &-main {
    gap: 24px;
    .logotype {
      font-size: 240px;
    }
  }
}

@media (max-width: 1200px) {
  .page {
    &-main {
      .logotype {
        font-size: 180px;
      }
    }
  }
}

@media (max-width: 900px) {
  .page {
    &-main {
      .logotype {
        font-size: 140px;
      }
    }
  }
}

@media (max-width: 680px) {
  .page {
    &-main {
      .logotype {
        font-size: 80px;
      }
    }
  }
}

@media (max-width: 400px) {
  .page {
    &-main {
      .logotype {
        font-size: 60px;
      }
    }
  }
}
</style>
