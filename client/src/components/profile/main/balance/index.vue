<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive } from 'vue';
import { PaymentDto, PaymentTariffType } from '@/interfaces/payment/payment.dto';
import { useNotificationStore } from '@/store/notification';
import { useUserStore } from '@/store/user';
import { openLink } from '@/utils/global';
import spaceFilter from '@/filters/space.filter';
import paymentAPI from '@/api/payment';
import cardAPI from '@/api/card';

import PaymentCard from './card/index.vue';
import PaymentTrial from './trial/index.vue';
import PaymentActions from './actions/index.vue';
import socket from '@/socket';
import { SocketEvent } from '@/utils/enums/socket';

const emit = defineEmits<{
  (e: 'toggleTransaction'): void;
}>();

const userStore = useUserStore();
const payment = computed(() => userStore.payment as PaymentDto);

const state = reactive({
  pending: {
    create: false,
    delete: false,
  },
});

const initialReserve = async (type: PaymentTariffType) => {
  try {
    const { data } = await paymentAPI.initialReserve(type);
    openLink(data.url);
  } finally {
    console.log('done');
  }
};

const createCard = async () => {
  if (payment.value?.trial) return;
  state.pending.create = true;
  try {
    const { data } = await cardAPI.create();
    openLink(data.url);
  } finally {
    state.pending.create = false;
  }
};

const deleteCard = async () => {
  if (payment.value?.trial) return;
  state.pending.delete = true;
  try {
    await cardAPI.deleteItem();
    userStore.destroyCard();
  } finally {
    state.pending.delete = false;
  }
};

const cardAction = (data: any) => {
  console.log(data);
};

onMounted(() => {
  socket.on(SocketEvent.CARD_ACTION, cardAction);
});

onUnmounted(() => {
  socket.off(SocketEvent.CARD_ACTION, cardAction);
});
</script>

<template>
  <div v-if="payment" class="balance flex-column">
    <div class="balance-title flex-center-between">
      <span class="fz20">Общий баланс</span>
      <payment-card
        v-if="payment.card && payment.card.active"
        :card="payment.card"
        @delete-card="deleteCard"
      ></payment-card>
    </div>
    <div class="balance-container flex flex-is">
      <div class="amount fw500 fz48 yellow">{{ spaceFilter(payment.balance) }}₽</div>
    </div>
    <payment-actions
      :payment="payment"
      @create-card="createCard"
      @toggle-transaction="emit('toggleTransaction')"
    ></payment-actions>
    <payment-trial
      v-if="payment.trial"
      :date="payment.subscriptionAt"
      @initial-reserve="initialReserve"
    ></payment-trial>
  </div>
</template>

<style scoped lang="scss">
.balance {
  gap: 12px;
  position: relative;
  &-container {
    gap: 12px;
    img {
      position: relative;
      top: 8px;
    }
  }
  &-actions {
    gap: 24px;
  }
}
</style>
