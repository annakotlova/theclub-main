<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/store/user';

import Media from '@/plugins/media/index.vue';

const userStore = useUserStore();
const user = computed(() => userStore.user);
</script>

<template>
  <router-link :to="{ name: 'Profile' }" class="profile">
    <div class="profile-avatar">
      <media :image="user?.avatar"></media>
    </div>
  </router-link>
</template>

<style scoped lang="scss">
.profile {
  &-avatar {
    $px: 44px;
    width: $px;
    height: $px;
    border-radius: $px;
    border: 1px solid var(--white_color);
  }
}
</style>
