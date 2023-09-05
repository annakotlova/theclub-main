<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/store/user';
import { useAuthStore } from '@/store/auth';
import { useGlobalStore } from '@/store/global';

import Event from './user/event/index.vue';
import Profile from './user/profile/index.vue';
import Logotype from './menu/logotype/index.vue';
import Navigation from './menu/navigation/index.vue';
import Notification from './menu/notification/index.vue';

const authStore = useAuthStore();
const userStore = useUserStore();
const globalStore = useGlobalStore();
const isActivated = computed(() => userStore.user?.activated);
</script>

<template>
  <header class="header">
    <div class="header-wrapper flex-center-between">
      <div class="header-menu flex flex-ic">
        <logotype></logotype>
        <navigation v-if="isActivated"></navigation>
      </div>
      <div class="header-user flex flex-ic">
        <template v-if="isActivated">
          <notification></notification>
          <event v-if="!globalStore.isMobile"></event>
          <profile></profile>
        </template>
        <template v-else>
          <div class="link" @click="authStore.logout">
            <span>Сменить пользователя</span>
          </div>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  width: 100%;
  background-color: var(--black_color);
  &-wrapper {
    width: 90%;
    margin: 0 auto;
    padding: 16px 0;
  }
  &-menu,
  &-user {
    gap: 24px;
  }
}

@media (max-width: 1440px) {
  .header {
    &-wrapper {
      padding: 16px 32px;
      margin: unset;
      width: 100%;
    }
  }
}

@media (max-width: 720px) {
  .header {
    &-wrapper {
      padding: 16px;
    }
    &-menu,
    &-user {
      gap: 16px;
    }
  }
}
</style>
