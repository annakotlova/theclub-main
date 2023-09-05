<script setup lang="ts">
import { UserDto } from '@/interfaces/user/user.dto';

import Media from '@/plugins/media/index.vue';

const props = defineProps<{
  member: UserDto;
}>();

const currentName = () => {
  const name = props.member.name.split(' ');
  return name[1] || name[0];
};
</script>

<template>
  <div class="referral-item flex-column flex-center">
    <div class="avatar">
      <media :image="member.avatar"></media>
    </div>
    <div class="name fz14 fw200">{{ currentName() }}</div>
  </div>
</template>

<style scoped lang="scss">
.referral-item {
  gap: 6px;
  .avatar {
    $px: 64px;
    width: $px;
    height: $px;
    border-radius: $px;
    border: 1px solid var(--white_color);
  }
}
</style>
