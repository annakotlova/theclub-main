<script setup lang="ts">
import { IconProps } from '@/interfaces/common/index.dto';

defineProps<IconProps>();
</script>

<template>
  <img
    v-lazy="src"
    class="icon"
    :alt="alt || 'icon'"
    :style="[{ width: size }, { height: size }]"
    :class="classList || ''"
  />
</template>