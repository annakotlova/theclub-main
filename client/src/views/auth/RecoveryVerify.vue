<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { RECOVERY_INPUTS } from '@/utils/input/auth';
import authAPI from '@/api/auth';

import Structure from '@action/structure/index.vue';

const router = useRouter();
const state = reactive({
  pending: false,
});

const form = reactive(RECOVERY_INPUTS);

const submit = async () => {
  state.pending = true;
  try {
    await authAPI.recoveryPassword(form.data);
    router.push({ name: 'Signin' });
  } finally {
    state.pending = false;
  }
};
</script>

<template>
  <section class="recovery flex-column">
    <div class="recovery-title flex-column">
      <h1>Шаг 3</h1>
      <div class="recovery-title--route flex flex-c fz20">
        <span>Вспомнили пароль?</span>
        <router-link :to="{ name: 'Signin' }">Войти</router-link>
      </div>
    </div>
    <div class="recovery-description fz20">
      <span>Придумайте новый пароль для вашего аккаунта</span>
    </div>
    <div class="recovery-form">
      <structure :module="form"></structure>
    </div>
    <div class="recovery-action flex flex-je">
      <button v-if="state.pending" class="btn btn-main btn-disabled">Продолжить</button>
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
