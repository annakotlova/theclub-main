<script setup lang="ts">
import { useNotificationStore } from '@/store/notification';
import { NOTIFICATION_MESSAGE } from '@/utils/enums/notification';
import { copyLink } from '@/utils/global';
import IconCommonCopy from '@icons/common/copy.vue';

const props = defineProps<{
  text: string;
  link: string;
}>();

const notification = useNotificationStore().create;

const referralLink = import.meta.env.VITE_REFERRAL_URL;
const copy = () => {
  copyLink(referralLink + props.link);
  notification({ message: NOTIFICATION_MESSAGE.COPY_LINK, type: 'info' });
};
</script>

<template>
  <div class="copy yellow flex flex-ic cursor-pointer fz14" @click="copy">
    <span>{{ text }}</span>
    <icon-common-copy size="20px"></icon-common-copy>
  </div>
</template>

<style scoped lang="scss">
.copy {
  user-select: none;
  width: fit-content;
  border: 1px solid var(--yellow_color);
  border-radius: 12px;
  padding: 12px 18px;
  gap: 16px;
}
</style>
