<script setup lang="ts">
import Icon from '@icons/index.vue';
import src from '@/assets/icons/menu/event.svg';
import { IconProps } from '@/interfaces/common/index.dto';

const props = defineProps<IconProps>();
</script>

<template>
  <icon class="icon-menu-event" v-bind="props" :src="src"></icon>
</template>

<style scoped lang="scss"></style>
