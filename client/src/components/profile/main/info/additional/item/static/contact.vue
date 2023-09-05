<script setup lang="ts">
import dateFilter from '@/filters/date.filter';

import IconCommonPhone from '@icons/common/phone.vue';
import IconCommonCalendar from '@icons/common/calendar.vue';

defineProps<{
  phone: string;
  birthday: string | null;
}>();
</script>

<template>
  <div class="static flex flex-ic">
    <div class="item flex flex-ic">
      <icon-common-phone size="24px"></icon-common-phone>
      <span>{{ phone }}</span>
    </div>
    <div class="item flex flex-ic">
      <icon-common-calendar size="24px"></icon-common-calendar>
      <span>{{ dateFilter(birthday) || '--' }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.static {
  gap: 24px;
  .item {
    gap: 8px;
  }
}
</style>
