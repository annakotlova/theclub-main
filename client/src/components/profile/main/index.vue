<script setup lang="ts">
import { reactive } from 'vue';
import { useGlobalStore } from '@/store/global';

import ProfileImage from './image/index.vue';
import ProfileInfo from './info/index.vue';
import ProfileBalance from './balance/index.vue';
import ProfileSubject from './subject/index.vue';
import ProfileReferral from './referral/index.vue';
import ProfileReferralList from './referrals/index.vue';
import ProfileTransactionList from './transaction/index.vue';

const global = useGlobalStore();
const state = reactive({
  referralList: false,
  transactionList: false,
});

const toggleTransaction = () => {
  state.transactionList = !state.transactionList;
};

const toggleReferral = () => {
  state.referralList = !state.referralList;
};
</script>

<template>
  <section class="profile flex common-block">
    <profile-image></profile-image>
    <profile-info></profile-info>
    <aside class="profile-sidebar flex-column">
      <profile-referral-list
        v-if="state.referralList"
        @toggle-referral="toggleReferral"
      ></profile-referral-list>
      <profile-transaction-list
        v-else-if="state.transactionList"
        @toggle-transaction="toggleTransaction"
      ></profile-transaction-list>
      <template v-else>
        <profile-balance @toggle-transaction="toggleTransaction"></profile-balance>
        <div v-if="global.isMobile" class="separator"></div>
        <profile-subject></profile-subject>
        <div v-if="global.isMobile" class="separator"></div>
        <profile-referral @toggle-referral="toggleReferral"></profile-referral>
      </template>
    </aside>
  </section>
</template>

<style scoped lang="scss">
.profile {
  gap: 2%;
  position: relative;
  &-info {
    width: 45%;
  }
  &-sidebar {
    width: 53%;
    flex: 1 1 auto;
    gap: 24px;
    .separator {
      padding: 0;
      width: 100%;
      height: 1px;
      background-color: var(--black_color);
    }
  }
  &-sidebar > div,
  > div {
    background: var(--block_color);
    border-radius: 12px;
    padding: 24px;
  }
}

@media (max-width: 1260px) {
  .profile {
    flex-direction: column;
    &-info,
    &-sidebar {
      width: 100%;
    }
    &-sidebar {
      gap: 12px;
    }
  }
}
</style>
