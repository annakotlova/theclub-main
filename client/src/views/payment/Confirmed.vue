<script setup lang="ts">
import IconPaymentConfirmed from '@icons/payment/confirmed.vue';
</script>

<template>
  <section class="payment-success common-block flex-column flex-center yellow">
    <icon-payment-confirmed></icon-payment-confirmed>
    <span class="fz32 fw700">Оплата прошла успешно</span>
  </section>
</template>

<style scoped lang="scss">
.payment-success {
  gap: 24px;
}
</style>
