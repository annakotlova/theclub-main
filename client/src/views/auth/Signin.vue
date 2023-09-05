<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { SIGNIN_INPUTS } from '@/utils/input/auth';
import authAPI from '@/api/auth';

import Structure from '@action/structure/index.vue';

const router = useRouter();
const state = reactive({
  pending: false,
});

const form = reactive(SIGNIN_INPUTS);

const submit = async () => {
  state.pending = true;
  try {
    await authAPI.signin(form.data);
    sessionStorage.clear();

    router.push({ name: 'Payment' });
  } catch (error) {
    state.pending = false;
  }
};
</script>

<template>
  <section class="signin flex-column">
    <div class="signin-title flex-column">
      <h1>Хай!</h1>
      <div class="signin-title--route flex flex-c fz20">
        <span>Нет аккаунта?</span>
        <router-link :to="{ name: 'Signup' }">Зарегистрироваться</router-link>
      </div>
    </div>
    <div class="signin-form flex-column">
      <structure :module="form"></structure>
      <router-link :to="{ name: 'Recovery' }">Восстановить пароль</router-link>
    </div>
    <div class="signin-action flex flex-je">
      <button v-if="state.pending" class="btn btn-main btn-disabled">Войти</button>
      <button v-else class="btn btn-main" @click="submit">Войти</button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.signin {
  gap: 24px;
  &-title {
    gap: 12px;
    &--route {
      gap: 8px;
    }
  }
  &-form {
    margin: 32px 0;
    gap: 6px;
  }
}

@media (max-width: 600px) {
  .signin {
    &-title {
      margin-bottom: 0;
      &--route {
        font-size: 16px;
      }
    }
  }
}
</style>
