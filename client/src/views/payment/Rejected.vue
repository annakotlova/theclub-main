<script setup lang="ts">
import IconPaymentRejected from '@icons/payment/rejected.vue';
</script>

<template>
  <section class="payment-fail flex-column">
    <div class="payment-fail--container common-block flex-column flex-center red">
      <icon-payment-rejected></icon-payment-rejected>
      <span class="fz32 fw700">Оплата не прошла</span>
    </div>
    <router-link :to="{ name: 'Payment' }" class="payment-fail--action">
      <button class="btn btn-black btn-max">Повторить</button>
    </router-link>
  </section>
</template>

<style scoped lang="scss">
.payment-fail {
  gap: 24px;
  &--container {
    gap: 24px;
  }
}
</style>
