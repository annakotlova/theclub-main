<script setup lang="ts">
import { UserDto } from '@/interfaces/user/user.dto';

import Media from '@/plugins/media/index.vue';

defineProps<{
  user: UserDto;
  isSelected: boolean;
}>();
</script>

<template>
  <div class="user-item flex flex-ic cursor-pointer" :class="{ selected: isSelected }">
    <div class="user-item--avatar">
      <media :image="user.avatar"></media>
    </div>
    <div class="user-item--name text text-1">{{ user.name }}</div>
  </div>
</template>

<style scoped lang="scss">
.user-item {
  gap: 16px;
  padding: 12px 8px;
  transition: 0.3s all;
  &--avatar {
    $px: 44px;
    width: $px;
    height: $px;
    border-radius: $px;
  }
  &:hover {
    transition: 0.3s all;
    background-color: var(--black_opacity_color);
  }
  &.selected {
    border-radius: 6px;
    background-color: var(--yellow_color);
    color: var(--black_color);
    transition: 0.3s all;
    &:hover {
      background-color: var(--yellow_color);
    }
  }
}
</style>
