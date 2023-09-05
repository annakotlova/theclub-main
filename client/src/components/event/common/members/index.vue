<script setup lang="ts">
import IconCommonUser from '@icons/menu/user.vue';

defineProps<{
  members: number;
  max: number;
}>();
</script>

<template>
  <div class="event-common-members flex flex-ic">
    <icon-common-user size="18px" class-list="yellow_filter"></icon-common-user>
    <span>{{ members }}/{{ max }}</span>
  </div>
</template>

<style scoped lang="scss">
.event-common-members {
  gap: 12px;
}
</style>
