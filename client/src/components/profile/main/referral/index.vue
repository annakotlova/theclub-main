<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useUserStore } from '@/store/user';
import { wordEndings } from '@/utils/wordEndings';
import { ReferralDto } from '@/interfaces/referral/referral.dto';
import referralAPI from '@/api/referral';

import ReferralItem from './item/index.vue';
import CommonCopy from '@action/copy/index.vue';

const emit = defineEmits<{
  (e: 'toggleReferral'): void;
}>();

const userStore = useUserStore();
const referral = computed(() => userStore.referral as ReferralDto);
const unViewedCount = computed(() => referral.value.members.filter((m) => !m.viewed).length);

const limit = (array: Array<any>, limit: number) => {
  return array.slice(0, limit);
};

onMounted(() => {
  setTimeout(() => {
    if (unViewedCount.value) referralAPI.viewed();
  }, 2000);
});
</script>

<template>
  <div v-if="referral" class="referral flex-column">
    <div class="referral-title flex-center-between">
      <div class="name flex flex-ic">
        <span class="fz20">Рефералы</span>
        <span class="gray fz16">
          {{ referral.members.length }} {{ wordEndings(referral.members.length, 'people') }}
        </span>
        <div v-if="unViewedCount" class="unviewed fz12 black">+{{ unViewedCount }}</div>
      </div>
      <div
        v-if="referral.members.length"
        class="show link cursor-pointer"
        @click="emit('toggleReferral')"
      >
        Показать всех
      </div>
    </div>
    <div v-if="referral.members.length" class="referral-container grid">
      <referral-item
        v-for="member of limit(referral?.members, 10)"
        :key="member.member._id"
        :member="member.member"
      ></referral-item>
    </div>
    <div class="referral-container flex-center">
      <common-copy
        text="Скопируй ссылку для привлечения рефералов"
        :link="referral.code"
      ></common-copy>
    </div>
  </div>
</template>

<style scoped lang="scss">
.referral {
  gap: 24px;
  &-title {
    gap: 40px;
    .name {
      gap: 12px;
      .unviewed {
        border-radius: 8px;
        padding: 2px 6px;
        background-color: var(--yellow_color);
      }
    }
  }
  &-container {
    grid-template-columns: repeat(5, 1fr);
    gap: 32px;
    &.flex-center {
      padding-top: 16px;
    }
  }
}

@media (max-width: 1360px) {
  .referral {
    &-container {
      grid-template-columns: repeat(4, 1fr);
      > div:nth-child(10),
      > div:nth-child(9) {
        display: none;
      }
    }
  }
}

@media (max-width: 960px) {
  .referral {

    &-container {
      grid-template-columns: repeat(5, 1fr);
      > div {
        display: flex !important;
      }
    }
  }
}

@media (max-width: 680px) {
  .referral {
    &-title {
      gap: 12px;
    }
    &-container {
      grid-template-columns: repeat(4, 1fr);
      > div:nth-child(10),
      > div:nth-child(9) {
        display: none !important;
      }
    }
  }
}

@media (max-width: 440px) {
  .referral {
    &-container {
      grid-template-columns: repeat(3, 1fr);
      > div:nth-child(8),
      > div:nth-child(7) {
        display: none !important;
      }
    }
  }
}
</style>
