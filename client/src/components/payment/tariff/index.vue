<script setup lang="ts">
import spaceFilter from '@/filters/space.filter';
import {
  PaymentTariff,
  PaymentTariffType,
  PaymentTariffName,
  PaymentTariffPrice,
  PaymentCreditPeriod,
} from '@/interfaces/payment/payment.dto';

const emit = defineEmits<{
  (e: 'initialPayment', type: PaymentTariffType, period?: PaymentCreditPeriod): void;
}>();

defineProps<{
  tariff: PaymentTariff;
}>();
</script>

<template>
  <div class="tariff flex-column">
    <div class="tariff-container flex-column flex-ic">
      <div class="tariff-name fz32 fw600">
        {{ PaymentTariffName[tariff] }}
      </div>
      <ul class="tariff-description fz16">
        <li>Доступ к веб-версии приложения коммьюнити.</li>
        <li>Доступ ко всем образовательным программам по направлениям, разум, дух и тело.</li>
        <li>Возможность создавать собственные встречи в офлайн и онлайн-формате.</li>
      </ul>
      <div class="tariff-price yellow fz40 fw600">
        <span>{{ spaceFilter(PaymentTariffPrice[tariff]) }} ₽</span>
      </div>
      <div class="tariff-actions flex-column">
        <!-- <button class="btn btn-main" @click="emit('initialPayment', PaymentTariffType.RESERVE)">
          Внести 5 тыс руб для брони
        </button> -->
        <button class="btn btn-main" @click="emit('initialPayment', PaymentTariffType.CASH)">
          Оплатить полностью
        </button>
        <div class="action flex-column yellow">
          <div class="action-title">В рассрочку</div>
          <div class="action-container flex-center-between">
            <button
              class="btn btn-border"
              @click="emit('initialPayment', PaymentTariffType.CREDIT, PaymentCreditPeriod.THREE)"
            >
              3 месяца
            </button>
            <button
              class="btn btn-border"
              @click="emit('initialPayment', PaymentTariffType.CREDIT, PaymentCreditPeriod.SIX)"
            >
              6 месяцев
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tariff {
  gap: 24px;
  width: 45%;
  &-container {
    gap: 32px;
    padding: 32px;
    border-radius: 12px;
    transition: 0.3s all;
    background-color: var(--black_color);
  }
  &-description {
    line-height: 135%;
    list-style: disc;
  }
  &-actions {
    width: 100%;
    gap: 24px;
    .action {
      gap: 12px;
      &-container {
        gap: 12px;
        button {
          flex: 1 1 auto;
          padding: 12px 24px;
          border-radius: 32px;
          font-size: 16px;
        }
      }
    }
  }
}

@media (max-width: 1200px) {
  .tariff {
    &-name {
      font-size: 24px;
    }
  }
}

@media (max-width: 900px) {
  .tariff {
    width: 100%;
    &-actions {
      button {
        font-size: 14px;
        padding: 12px 24px;
      }
    }
  }
}

@media (max-width: 600px) {
  .tariff {
    &-container {
      padding: 24px;
    }
    &-price {
      font-size: 36px;
    }
  }
}
</style>
