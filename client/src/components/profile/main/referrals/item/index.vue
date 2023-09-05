<script setup lang="ts">
import { UserDto } from '@/interfaces/user/user.dto';

import Media from '@/plugins/media/index.vue';

defineProps<{
  member: UserDto;
  selected: boolean;
}>();
</script>

<template>
  <div class="member flex flex-ic cursor-pointer" :class="{ selected }">
    <div class="member-avatar">
      <media :image="member.avatar"></media>
    </div>
    <div class="member-info">
      <span class="text text-1">{{ member.name }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.member {
  transition: 0.3s all;
  padding: 16px 24px;
  gap: 16px;
  &-avatar {
    $px: 46px;
    min-width: $px;
    width: $px;
    height: $px;
    border-radius: $px;
    border: 1px solid var(--yellow_color);
  }
  &:not(:last-child) {
    border-bottom: 1px solid var(--black_color);
  }
  &.selected {
    background-color: var(--yellow_color);
    color: var(--black_color);
    transition: 0.3s all;
  }
}

@media (max-width: 960px) {
  .member {
    border-radius: 8px;
  }
}
</style>
