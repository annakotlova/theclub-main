<script setup lang="ts">
import IconCommonLogotype from '@icons/common/logotype.vue';
</script>

<template>
  <router-link :to="{ name: 'EventList' }" class="logotype">
    <icon-common-logotype></icon-common-logotype>
  </router-link>
</template>

<style scoped lang="scss">
a {
  img {
    width: 102px;
    height: 44px;
  }
}
</style>