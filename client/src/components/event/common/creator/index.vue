<script setup lang="ts">
import { UserDto } from '@/interfaces/user/user.dto';

import Media from '@/plugins/media/index.vue';

defineProps<{
  creator: UserDto;
}>();
</script>

<template>
  <div class="event-common-creator flex flex-ic fz14">
    <div class="event-common-creator--avatar">
      <media :image="creator.avatar"></media>
    </div>
    <div class="event-common-creator--name">
      <span class="text text-1">{{ creator.name }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.event-common-creator {
  gap: 16px;
  &--avatar {
    $px: 40px;
    min-width: $px;
    width: $px;
    height: $px;
    border-radius: $px;
  }
}
</style>
