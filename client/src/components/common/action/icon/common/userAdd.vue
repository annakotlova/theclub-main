<script setup lang="ts">
import Icon from '@icons/index.vue';
import src from '@/assets/icons/common/userAdd.svg';
import { IconProps } from '@/interfaces/common/index.dto';

const props = defineProps<IconProps>();
</script>

<template>
  <icon class="icon-common-userAdd" v-bind="props" :src="src"></icon>
</template>

<style scoped lang="scss"></style>
