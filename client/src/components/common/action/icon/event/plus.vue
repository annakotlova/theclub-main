<script setup lang="ts">
import Icon from '@icons/index.vue';
import src from '@/assets/icons/event/plus.svg';
import { IconProps } from '@/interfaces/common/index.dto';

const props = defineProps<IconProps>();
</script>

<template>
  <icon class="icon-event-plus" v-bind="props" :src="src"></icon>
</template>

<style scoped lang="scss"></style>
