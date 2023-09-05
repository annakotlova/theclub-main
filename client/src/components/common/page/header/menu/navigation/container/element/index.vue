<script setup lang="ts">
import { Navigation } from '@/interfaces/common/navigation.dto';

const emit = defineEmits<{
  (e: 'routing'): void;
}>();

defineProps<{
  route: Navigation;
}>();
</script>

<template>
  <router-link v-slot="{ isExactActive }" :to="{ name: route.path }" custom>
    <li
      class="cursor-pointer flex flex-ic"
      :class="{ active: isExactActive }"
      @click="emit('routing')"
    >
      <component :is="route.icon" size="24px" :class="{ 'yellow_filter': isExactActive }"></component>
      <span class="fz18">{{ route.name }}</span>
    </li>
  </router-link>
</template>

<style scoped lang="scss">
li {
  gap: 12px;
  color: var(--white_color);
  &.active {
    color: var(--yellow_color);
  }
}
</style>
