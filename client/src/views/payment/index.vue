<script setup lang="ts">
import { reactive } from 'vue';
import {
  PaymentCreditPeriod,
  PaymentTariff,
  PaymentTariffType,
} from '@/interfaces/payment/payment.dto';
import { openLink } from '@/utils/global';
import paymentAPI from '@/api/payment';

import Tariff from '@/components/payment/tariff/index.vue';

const state = reactive({
  pending: false,
});

const initialPayment = async (
  tariff: PaymentTariff,
  type: PaymentTariffType,
  period?: PaymentCreditPeriod,
) => {
  if (state.pending) return;
  state.pending = true;

  try {
    const { data } = await paymentAPI.initial(tariff, type, period);
    openLink(data.url);
  } finally {
    state.pending = false;
  }
};

const validatePayment = () => {
  const tariff = sessionStorage.getItem('tariff') as PaymentTariff;
  const type = sessionStorage.getItem('tariff_type') as PaymentTariffType;
  if (!tariff || !PaymentTariff[tariff] || !type || !PaymentTariffType[type]) return;

  initialPayment(tariff, type);
};

validatePayment();
</script>

<template>
  <section class="payment flex-column">
    <div class="payment-description text-center fz32 fw700 black">
      <div>Чтобы получить доступ к мероприятиям клуба</div>
      <div>Выбери подписку и оплати</div>
    </div>
    <div class="payment-tariffs flex-center-between">
      <tariff
        v-for="tariff in PaymentTariff"
        :key="tariff"
        :tariff="tariff"
        @initial-payment="(type, period) => initialPayment(tariff, type, period)"
      ></tariff>
    </div>
  </section>
</template>

<style scoped lang="scss">
.payment {
  width: 75%;
  gap: 72px;
  &-description {
    text-transform: uppercase;
  }
}

@media (max-width: 1200px) {
  .payment {
    &-description {
      font-size: 24px;
    }
  }
}

@media (max-width: 900px) {
  .payment {
    width: 100%;
    gap: 32px;
    &-tariffs {
      gap: 24px;
      flex-direction: column;
    }
  }
}

@media (max-width: 680px) {
  .payment {
    &-description {
      font-size: 20px;
    }
  }
}

@media (max-width: 400px) {
  .payment {
    &-description {
      font-size: 16px;
    }
  }
}
</style>
