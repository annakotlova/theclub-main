<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import authAPI from '@/api/auth';

import CommonCode from '@action/code/index.vue';

const router = useRouter();
const state = reactive({
  seconds: 59,
  success: false,
  error: false,
});

const resendCode = async () => {
  if (state.success || state.seconds) return;
  await authAPI.resendCode();
  state.seconds = 59;
  state.success = state.error = false;
  startTimer();
};

const recoveryCode = async (code: string) => {
  if (state.success) return;

  try {
    await authAPI.recoveryCode({ code });
    state.success = true;
  } catch (err) {
    state.error = true;
  }
};

const interval = ref();
const startTimer = () => {
  interval.value = setInterval(() => {
    state.seconds--;
    if (state.seconds <= 0) stopTimer();
  }, 1000);
};

const stopTimer = () => {
  clearInterval(interval.value);
};

const submit = () => {
  router.push({ name: 'RecoveryVerify' });
};

const inputCode = () => {
  state.error = false;
};

onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  stopTimer();
});
</script>

<template>
  <section class="recovery flex-column">
    <div class="recovery-title flex-column">
      <h1>Шаг 2</h1>
      <div class="recovery-title--route flex flex-c fz20">
        <span>Вспомнили пароль?</span>
        <router-link :to="{ name: 'Signin' }">Войти</router-link>
      </div>
    </div>
    <div class="recovery-description fz20">
      <span>Введите проверочный код, отправленный на ваш телефон</span>
    </div>
    <div class="recovery-form">
      <common-code
        :seconds="state.seconds"
        :error="state.error"
        :success="state.success"
        @input="inputCode"
        @resend="resendCode"
        @validate="recoveryCode"
      ></common-code>
    </div>
    <div class="recovery-action flex flex-je">
      <button v-if="!state.success" class="btn btn-main btn-disabled">Продолжить</button>
      <button v-else class="btn btn-main" @click="submit">Продолжить</button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.recovery {
  gap: 24px;
  &-title {
    gap: 12px;
    &--route {
      gap: 8px;
    }
  }
  &-form {
    margin: 36px 0;
  }
}

@media (max-width: 600px) {
  .recovery {
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
