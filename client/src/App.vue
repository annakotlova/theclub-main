<template>
  <component :is="layout">
    <router-view />
  </component>
  <notification></notification>
</template>

<script lang="ts">
import { defineAsyncComponent, defineComponent } from 'vue';
import { useGlobalStore } from './store/global';

const AuthLayout = defineAsyncComponent(() => import('./layouts/Auth.vue'));
const PaymentLayout = defineAsyncComponent(() => import('./layouts/Payment.vue'));
const MainLayout = defineAsyncComponent(() => import('./layouts/Main.vue'));
const Notification = defineAsyncComponent(() => import('@/plugins/notification/main/index.vue'));

export default defineComponent({
  name: 'App',
  mounted() {
    window.addEventListener('resize', useGlobalStore().updateInnerWidth);
  },
  computed: {
    layout() {
      return this.$route.meta.layout + '-layout';
    },
  },
  components: {
    Notification,
    PaymentLayout,
    AuthLayout,
    MainLayout,
  },
});
</script>

<style lang="scss">
@import './assets/scss/index.scss';
</style>
