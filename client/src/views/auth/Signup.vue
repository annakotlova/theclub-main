<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { PaymentTariff, PaymentTariffType } from '@/interfaces/payment/payment.dto';
import { NOTIFICATION_MESSAGE } from '@/utils/enums/notification';
import { useNotificationStore } from '@/store/notification';
import { SEND_CODE_INPUTS } from '@/utils/input/auth';
import { UserDto } from '@/interfaces/user/user.dto';
import referralAPI from '@/api/referral';
import authAPI from '@/api/auth';

import Structure from '@action/structure/index.vue';

const props = defineProps<{
  referral?: string;
}>();

const referral = props.referral || localStorage.getItem('referral');
const notification = useNotificationStore();
const route = useRoute();
const router = useRouter();
const state = reactive({
  pending: false,
  name: '',
});

const form = reactive(SEND_CODE_INPUTS);

const submit = async () => {
  state.pending = true;
  try {
    await authAPI.sendCode(form.data, referral);
    router.push({ name: 'SignupCode' });
  } catch (error) {
    state.pending = false;
  }
};

const validateReferral = async () => {
  if (!referral) return;

  try {
    const { data } = await referralAPI.validate(referral);
    const user = data.user as any as UserDto;
    state.name = user.name;

    localStorage.setItem('referral', referral);
  } catch (_) {
    notification.create({ message: NOTIFICATION_MESSAGE.REFERRAL_VALIDATE_ERROR, type: 'warning' });
    router.push({ name: 'Signup' });
  }
};

const validateTariff = () => {
  const tariff = route.query.tariff as PaymentTariff;
  const type = route.query.type as PaymentTariffType;
  if (!tariff || !PaymentTariff[tariff] || !type || !PaymentTariffType[type]) return;

  sessionStorage.setItem('tariff', tariff);
  sessionStorage.setItem('tariff_type', type);
};

validateReferral();
validateTariff();
</script>

<template>
  <section class="signup flex-column">
    <div class="signup-title flex-column">
      <h1>Хай!</h1>
      <div class="signup-title--route flex flex-c fz20">
        <span>Есть аккаунт?</span>
        <router-link :to="{ name: 'Signin' }">Войти</router-link>
      </div>
    </div>
    <div class="signup-description fz20">
      <span>Чтобы попасть в сервис, сначала введи телефон и мы вышлем код подтверждения</span>
    </div>
    <div class="signup-form flex-column">
      <structure :module="form"></structure>
      <transition name="fade">
        <div v-if="state.name" class="user">
          <span>Ваш реферал: <span class="yellow">{{ state.name }}</span></span>
        </div>
      </transition>
    </div>
    <div class="signup-action flex flex-je">
      <button v-if="state.pending" class="btn btn-main btn-disabled">Продолжить</button>
      <button v-else class="btn btn-main" @click="submit">Продолжить</button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.signup {
  gap: 24px;
  &-title {
    gap: 12px;
    &--route {
      gap: 8px;
    }
  }
  &-form {
    gap: 12px;
    margin: 36px 0;
  }
}

@media (max-width: 600px) {
  .signup {
    &-title {
      margin-bottom: 0;
      &--route {
        font-size: 16px;
      }
    }
    &-description {
      font-size: 16px;
    }
  }
}
</style>
