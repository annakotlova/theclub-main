<script setup lang="ts">
import { UserSubjectCommon, UserSubjectName } from '@/interfaces/user/user.dto';

import IconCommonCheck from '@icons/common/check.vue';

defineProps<{
  subject: UserSubjectCommon;
  selected: boolean;
}>();
</script>

<template>
  <div class="subject cursor-pointer flex-column" :class="{ selected }">
    <div class="subject-select flex-center">
      <transition name="scale">
        <icon-common-check v-if="selected"></icon-common-check>
      </transition>
    </div>
    <div class="subject-name yellow fw600 fz40 text-center">
      {{ UserSubjectName[subject] }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.subject {
  position: relative;
  width: 30%;
  gap: 32px;
  padding: 32px;
  border-radius: 12px;
  transition: 0.3s all;
  background-color: var(--black_color);
  &-select {
    $px: 24px;
    width: $px;
    height: $px;
    border-radius: 6px;
    background-color: var(--black_color);
    border: 1px solid var(--yellow_color);
    position: absolute;
    z-index: 1;
    top: 16px;
    right: 16px;
  }
  &.selected {
    transform: scale(1.025);
    transition: 0.3s all;
    background-color: var(--yellow_color);
    box-shadow: 0px 0px 60px rgba(172, 157, 6, 0.5);
    .subject-name {
      color: var(--black_color);
    }
  }
}

@media (max-width: 680px) {
  .subject {
    width: 100%;
  }
}
</style>
