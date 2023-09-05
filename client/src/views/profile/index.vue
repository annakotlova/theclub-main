<script setup lang="ts">
import ProfileMain from '@/components/profile/main/index.vue';
import ProfileMainMobile from '@/components/profile/main/Mobile.vue';
import ProfileCalendar from '@/components/profile/calendar/index.vue';
import { useGlobalStore } from '@/store/global';

const global = useGlobalStore();
</script>

<template>
  <section class="profile flex-column">
    <profile-main v-if="!global.isMobile"></profile-main>
    <profile-main-mobile v-else></profile-main-mobile>
    <profile-calendar></profile-calendar>
  </section>
</template>

<style scoped lang="scss">
.profile {
  gap: 32px;
}
</style>
