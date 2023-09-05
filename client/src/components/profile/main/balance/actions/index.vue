<script setup lang="ts">
import { PaymentDto } from '@/interfaces/payment/payment.dto';
import { useModalStore } from '@/store/modal';

const emit = defineEmits<{
  (e: 'toggleTransaction'): void;
  (e: 'createCard'): void;
}>();

defineProps<{
  payment: PaymentDto;
}>();

const modal = useModalStore();

const withdrawal = async () => {
  modal.create({ id: 'payment-withdrawal', data: {} });
};
</script>

<template>
  <div class="balance-actions flex flex-ic">
    <button
      v-if="payment.card && payment.card.active"
      class="btn btn-main flex-full fz16"
      @click="withdrawal"
    >
      Вывод средств
    </button>
    <button v-else class="btn btn-main flex-full fz16" @click="emit('createCard')">
      Привязать карту
    </button>
    <button class="btn btn-border fz16" @click="emit('toggleTransaction')">История операций</button>
  </div>
</template>

<style scoped lang="scss">
.balance-actions {
  gap: 24px;
}

@media (max-width: 680px) {
  .balance {
    &-actions {
      gap: 16px;
      flex-direction: column;
      button {
        width: 100%;
      }
    }
  }
}
</style>
