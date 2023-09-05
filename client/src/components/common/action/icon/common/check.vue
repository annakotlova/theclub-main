<script setup lang="ts">
import Icon from '@icons/index.vue';
import src from '@/assets/icons/common/check.svg';
import { IconProps } from '@/interfaces/common/index.dto';

const props = defineProps<IconProps>();
</script>

<template>
  <icon class="icon-common-check" v-bind="props" :src="src"></icon>
</template>

<style scoped lang="scss"></style>
