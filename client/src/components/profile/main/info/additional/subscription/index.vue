<script setup lang="ts">
import { computed } from 'vue';
import { PaymentDto } from '@/interfaces/payment/payment.dto';
import { useModalStore } from '@/store/modal';
import { useUserStore } from '@/store/user';
import dateFilter from '@/filters/date.filter';

const modal = useModalStore();
const userStore = useUserStore();
const payment = computed(() => userStore.payment as PaymentDto);

const cancelSubscription = () => {
  modal.create({ id: 'subscription-cancel', data: {} });
};
</script>

<template>
  <div class="info-subscription flex-column">
    <div class="title fw300 flex-center-between">
      <span class="yellow">Подписка</span>
    </div>
    <div v-if="payment" class="container flex flex-ic">
      <div>Подписка закончится:</div>
      <div>{{ dateFilter(payment.subscriptionAt, 'datetime') }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.info-subscription {
  gap: 12px;
  .container {
    gap: 8px;
  }
}
</style>
