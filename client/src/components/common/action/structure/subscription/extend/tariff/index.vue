<script setup lang="ts">
import spaceFilter from '@/filters/space.filter';
import {
  PaymentTariff,
  PaymentTariffName,
  PaymentTariffPrice,
} from '@/interfaces/payment/payment.dto';

defineProps<{
  tariff: PaymentTariff;
}>();
</script>

<template>
  <div class="tariff flex-center-between cursor-pointer">
    <div class="tariff-name fz20">
      {{ PaymentTariffName[tariff] }}
    </div>
    <div class="tariff-price yellow fz32 fw600">
      <span>{{ spaceFilter(PaymentTariffPrice[tariff]) }} ₽</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tariff {
  gap: 12px;
  padding: 24px;
  border-radius: 12px;
  transition: 0.5s all;
  background-color: var(--black_color);
  &:hover {
    transition: 0.5s all;
    background-color: var(--yellow_color);
    .tariff-name,
    .tariff-price {
      color: var(--black_color);
    }
  }
}
</style>
