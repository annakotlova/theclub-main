<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/store/user';
import { wordEndings } from '@/utils/wordEndings';
import { UserDto } from '@/interfaces/user/user.dto';
import { ReferralDto } from '@/interfaces/referral/referral.dto';

import Member from './item/index.vue';

const emit = defineEmits<{
  (e: 'toggleReferral'): void;
}>();

const userStore = useUserStore();
const referral = computed(() => userStore.referral as ReferralDto);
const referralMember = computed(() => userStore.referralMember);
const unViewedCount = computed(() => referral.value.members.filter((m) => !m.viewed).length);

const openReferral = (member: UserDto) => {
  userStore.setReferralMember(member);
};

const toggleReferral = () => {
  userStore.destroyReferralMember();
  emit('toggleReferral');
};
</script>

<template>
  <div class="referrals">
    <div class="referrals-title flex-center-between">
      <div class="left flex flex-ic">
        <span class="fz20">Рефералы</span>
        <span class="gray fz16">
          {{ referral.members.length }} {{ wordEndings(referral.members.length, 'people') }}
        </span>
        <div v-if="unViewedCount" class="unviewed fz12 black">+{{ unViewedCount }}</div>
      </div>
      <div class="right">
        <span class="link" @click="toggleReferral">Назад</span>
      </div>
    </div>
    <div class="referrals-container">
      <member
        v-for="member of referral.members"
        :key="member.member._id"
        :selected="referralMember?._id === member.member._id"
        :member="member.member"
        @click="openReferral(member.member)"
      ></member>
    </div>
  </div>
</template>

<style scoped lang="scss">
.referrals {
  width: 100%;
  height: 100%;
  max-height: 605px;
  overflow: auto;
  &-title {
    margin-bottom: 24px;
    .left {
      gap: 12px;
      .unviewed {
        border-radius: 8px;
        padding: 2px 6px;
        background-color: var(--yellow_color);
      }
    }
  }
  &-container {
    height: calc(100% - 47px);
    margin: 0 -24px;
    overflow: auto;
  }
}

@media (max-width: 1260px) {
  .referrals {
    &-container {
      margin: 0;
      height: 400px;
    }
  }
}
</style>
