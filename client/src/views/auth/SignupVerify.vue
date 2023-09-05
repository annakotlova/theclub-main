<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { SIGNUP_INPUTS } from '@/utils/input/auth';
import authAPI from '@/api/auth';

import Structure from '@action/structure/index.vue';

const router = useRouter();
const state = reactive({
  pending: false,
});

const form = reactive(SIGNUP_INPUTS);

const submit = async () => {
  state.pending = true;
  try {
    await authAPI.signup(form.data);
    router.push({ name: 'Profile' });
  } finally {
    state.pending = false;
  }
};
</script>

<template>
  <section class="signup flex-column">
    <div class="signup-title flex-column">
      <h1>Шаг 3</h1>
    </div>
    <div class="signup-description fz20">
      <span>Заполните поля ниже.</span>
    </div>
    <div class="signup-form">
      <structure :module="form"></structure>
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
