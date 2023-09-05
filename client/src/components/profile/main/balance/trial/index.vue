<script setup lang="ts">
import { PaymentTariffType } from '@/interfaces/payment/payment.dto';
import dateFilter from '@/filters/date.filter';

const emit = defineEmits<{
  (e: 'initialReserve', type: PaymentTariffType): void;
}>();

defineProps<{
  date: Date;
}>();
</script>

<template>
  <div class="balance-trial flex-column flex-center">
    <div class="description">Оплатите остаток по тарифу до {{ dateFilter(date) }}</div>
    <div class="actions flex">
      <button
        class="btn btn-main btn-small"
        @click="emit('initialReserve', PaymentTariffType.CASH)"
      >
        Оплатить
      </button>
      <button
        class="btn btn-border btn-small"
        @click="emit('initialReserve', PaymentTariffType.CREDIT)"
      >
        В рассрочку
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.balance-trial {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.86);
  border-radius: 12px;
  gap: 12px;
  padding: 24px;
  .actions {
    gap: 12px;
  }
}
</style>
