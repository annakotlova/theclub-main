<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';
import { UserSubjectCommon } from '@/interfaces/user/user.dto';
import userAPI from '@/api/user';

import Subject from '@/components/start/subject/index.vue';

const userStore = useUserStore();
const router = useRouter();
const state = reactive({
  pending: false,
  subjects: [] as Array<UserSubjectCommon>,
});

const selectSubject = async (subject: UserSubjectCommon) => {
  if (state.subjects.includes(subject))
    state.subjects = state.subjects.filter((s) => s !== subject);
  else state.subjects = [...state.subjects, subject];
};

const submit = async () => {
  state.pending = true;
  try {
    const { data } = await userAPI.updateSubjects(state.subjects);
    userStore.updateUser(data);
    router.push({ name: 'Start' });
  } catch (error) {
    state.pending = false;
  }
};
</script>

<template>
  <section class="subjects flex-column black">
    <div class="subjects-description text-center fz32 fw700">
      <div>Выбери тематику</div>
    </div>
    <div class="subjects-container flex-center-between">
      <subject
        v-for="subject in UserSubjectCommon"
        :key="subject"
        :subject="subject"
        :selected="state.subjects.includes(subject)"
        @click="selectSubject(subject)"
      ></subject>
    </div>
    <div class="subjects-action flex flex-je">
      <transition name="scale">
        <button v-if="state.subjects.length" class="btn btn-black" @click="submit">
          Продолжить
        </button>
      </transition>
    </div>
  </section>
</template>

<style scoped lang="scss">
.subjects {
  width: 70%;
  gap: 72px;
  &-description {
    text-transform: uppercase;
  }
}

@media (max-width: 900px) {
  .subjects {
    width: 100%;
    gap: 32px;
    &-description {
      font-size: 24px;
    }
  }
}

@media (max-width: 680px) {
  .subjects {
    &-container {
      gap: 32px;
      flex-direction: column;
    }
  }
}
</style>
