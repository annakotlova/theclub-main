<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/store/user';
import { UserDto } from '@/interfaces/user/user.dto';

import AdditionalItem from './item/index.vue';
import AdditionalSubscription from './subscription/index.vue';

const userStore = useUserStore();
const referralMember = computed(() => userStore.referralMember as UserDto);
</script>

<template>
  <div class="info-additional flex-column">
    <additional-item type="about"></additional-item>
    <div class="separator"></div>
    <additional-item type="contact"></additional-item>
    <div class="separator"></div>
    <additional-subscription v-if="!referralMember"></additional-subscription>
  </div>
</template>

<style scoped lang="scss">
.info-additional {
  gap: 20px;
  .separator {
    width: 100%;
    height: 1px;
    background-color: var(--darkborder_color);
  }
}
</style>
