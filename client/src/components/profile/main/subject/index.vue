<script setup lang="ts">
import { computed } from 'vue';
import { UserDto, UserSubject, UserSubjectCommon, UserSubjectName } from '@/interfaces/user/user.dto';
import { useUserStore } from '@/store/user';
import userAPI from '@/api/user';

const userStore = useUserStore();
const user = computed(() => userStore.user as UserDto);

const toggleSubject = async (subject: UserSubjectCommon) => {
  if (user.value.subjects.includes(subject))
    user.value.subjects = user.value.subjects.filter((s) => s !== subject);
  else user.value.subjects = [...user.value.subjects, subject];

  const { data } = await userAPI.updateSubjects(user.value.subjects);
  userStore.updateUser(data);
};
</script>

<template>
  <div class="subject flex-center-between">
    <div class="subject-title fz20">Выбранная тематика:</div>
    <div class="subject-container flex flex-ic">
      <div
        class="item gray cursor-pointer fw500"
        v-for="subject in UserSubjectCommon"
        :key="subject"
        :class="{ selected: user.subjects.includes(subject) }"
        @click="toggleSubject(subject)"
      >
        {{ UserSubjectName[subject] }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.subject {
  gap: 16px;
  &-container {
    gap: 16px;
    .item {
      border-radius: 8px;
      padding: 8px 16px;
      border: 1px solid var(--gray_color);
      transition: 0.3s all;
      &.selected {
        transition: 0.3s all;
        background-color: var(--yellow_color);
        border-color: var(--yellow_color);
        color: var(--black_color);
      }
    }
  }
}

@media (max-width: 1280px) {
  .subject {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
