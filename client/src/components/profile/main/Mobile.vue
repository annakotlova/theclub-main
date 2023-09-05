<script setup lang="ts">
import { computed, defineAsyncComponent, reactive } from 'vue';
import { useGlobalStore } from '@/store/global';
import { useUserStore } from '@/store/user';
import { UserDto } from '@/interfaces/user/user.dto';

import ProfileInfo from './info/index.vue';
import ProfileBalance from './balance/index.vue';
import ProfileSubject from './subject/index.vue';
import ProfileReferral from './referral/index.vue';
import ProfileReferralList from './referrals/index.vue';
import ProfileTransactionList from './transaction/index.vue';
import IconArrowDown from '@icons/arrow/down.vue';

const ProfileInfoMain = defineAsyncComponent(() => import('./info/main/index.vue'));

const global = useGlobalStore();
const userStore = useUserStore();
const referralMember = computed(() => userStore.referralMember as UserDto);

const state = reactive({
  referralList: false,
  transactionList: false,
  more: false,
});

const toggleTransaction = () => {
  state.transactionList = !state.transactionList;
};

const toggleReferral = () => {
  state.referralList = !state.referralList;
};
</script>

<template>
  <section class="profile flex-column">
    <div class="profile-common flex-column common-block">
      <profile-info-main></profile-info-main>
      <profile-balance
        v-if="!referralMember"
        @toggle-transaction="toggleTransaction"
      ></profile-balance>
      <profile-transaction-list
        v-if="state.transactionList && !referralMember"
        @toggle-transaction="toggleTransaction"
      ></profile-transaction-list>
      <aside v-else class="profile-more flex-column">
        <transition name="scale">
          <div v-if="state.more" class="profile-more--container">
            <profile-info :is-mobile="global.isMobile"></profile-info>
          </div>
        </transition>
        <div class="profile-more--header gray flex-center" @click="state.more = !state.more">
          <span>Подробнее</span>
          <icon-arrow-down size="16px" :class="{ show: state.more }"></icon-arrow-down>
        </div>
      </aside>
    </div>
    <div class="profile-additional common-block">
      <profile-referral-list
        v-if="state.referralList"
        @toggle-referral="toggleReferral"
      ></profile-referral-list>
      <profile-referral v-else @toggle-referral="toggleReferral"></profile-referral>
    </div>
    <div class="profile-additional common-block">
      <profile-subject></profile-subject>
    </div>
  </section>
</template>

<style scoped lang="scss">
.profile {
  gap: 24px;
  > div {
    padding: 16px;
    gap: 24px;
  }
  &-more {
    gap: 24px;
    &--header {
      gap: 6px;
      margin-bottom: 12px;
      img {
        transition: 0.3s all;
        &.show {
          transform: rotate(180deg);
          transition: 0.3s all;
        }
      }
    }
  }
}

// @media (max-width: 600px) {
//   .profile {
//     background-color: var(--block_color);
//     border-radius: 16px;
//     padding: 4px 0;
//     &-sidebar > div,
//     > div {
//       padding: 16px;
//     }
//   }
// }
</style>
