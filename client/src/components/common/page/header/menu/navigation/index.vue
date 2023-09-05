<script setup lang="ts">
import { useRouter } from 'vue-router';
import { openLink } from '@/utils/global';
import { useAuthStore } from '@/store/auth';
import { Navigation } from '@/interfaces/common/navigation.dto';

import Container from './container/index.vue';
import CommonDrop from '@action/drop/index.vue';
import IconCommonBurger from '@icons/common/burger.vue';
import IconCommonCancel from '@icons/common/cancel.vue';

const router = useRouter();
const authStore = useAuthStore();

const routing = (item: Navigation) => {
  if (item.id === 'logout') return authStore.logout();
  if (item.id === 'home') return openLink(import.meta.env.VITE_HOME_URL);

  router.push({ name: item.path });
};
</script>

<template>
  <div class="navigation">
    <common-drop element=".navigation" :container="{ top: '62px', left: '0px' }">
      <template #header="{ show }">
        <div class="navigation-title cursor-pointer flex-center">
          <transition-group name="scale">
            <icon-common-cancel
              v-if="show"
              size="24px"
              class-list="yellow_filter"
            ></icon-common-cancel>
            <icon-common-burger v-else size="24px"></icon-common-burger>
          </transition-group>
        </div>
      </template>
      <template #container="{ toggle }">
        <container @routing="(i) => { toggle(false); routing(i) }"></container>
      </template>
    </common-drop>
  </div>
</template>

<style scoped lang="scss">
.navigation {
  position: relative;
  &-title {
    $px: 44px;
    width: $px;
    height: $px;
    border-radius: 8px;
    background-color: var(--block_color);
    img {
      position: absolute;
    }
  }
}
</style>
