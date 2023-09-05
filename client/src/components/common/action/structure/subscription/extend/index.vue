<script setup lang="ts">
import { reactive } from 'vue';
import { StructureProps } from '@/interfaces/common/structure.dto';
import {
  PaymentTariff,
  PaymentTariffName,
  PaymentTariffType,
} from '@/interfaces/payment/payment.dto';
import { openLink } from '@/utils/global';
import paymentAPI from '@/api/payment';

import Tariff from './tariff/index.vue';

defineProps<{
  input: StructureProps['input'];
  data: StructureProps['data'];
}>();

const state = reactive({
  pending: false,
  tariff: '' as PaymentTariff,
});

const selectTariff = (tariff: PaymentTariff) => {
  state.tariff = tariff;
};

const selectType = async (type: PaymentTariffType) => {
  if (state.pending) return;
  state.pending = true;

  const request = type === PaymentTariffType.BALANCE ? 'initialBalance' : 'initial';

  try {
    const { data } = await paymentAPI[request](state.tariff, type);
    openLink(data.url);
  } finally {
    state.pending = false;
  }
};
</script>

<template>
  <div class="subscription flex-column">
    <div class="subscription-title">
      <span v-if="!state.tariff">
        Выберите предпочитаемый способ оплаты для продления подписки на клуб.
      </span>
      <span v-else>
        Выберите предпочитаемый способ оплаты для продления подписки на
        {{ PaymentTariffName[state.tariff] }}.
      </span>
    </div>
    <div v-if="!state.tariff" class="subscription-actions flex-column">
      <tariff
        v-for="tariff in PaymentTariff"
        :key="tariff"
        :tariff="tariff"
        @click="selectTariff(tariff)"
      ></tariff>
    </div>
    <div v-else class="subscription-actions flex-column">
      <button class="btn btn-main btn-max" @click="selectType(PaymentTariffType.CASH)">
        Оплатить картой
      </button>
      <button class="btn btn-main btn-max" @click="selectType(PaymentTariffType.BALANCE)">
        Списать со счёта The Club
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.subscription {
  gap: 32px;
  &-actions {
    gap: 12px;
  }
}
</style>
