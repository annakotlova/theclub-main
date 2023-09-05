<script setup lang="ts">
import { defineAsyncComponent, reactive } from 'vue';
import { StructureProps } from '@/interfaces/common/structure.dto';

import IconRatingStar from '@icons/review/star.vue';
const IconRatingRed = defineAsyncComponent(() => import('@icons/review/red.vue'));

const props = defineProps<{
  input: StructureProps['input'];
  data: StructureProps['data'];
  className?: string;
}>();

const state = reactive({
  hover: 0,
  select: 0,
});

const selectRating = (index: number) => {
  state.select = index;
  props.data.rating = index + 1;
};
</script>

<template>
  <div class="modal-review flex-column">
    <div class="stars flex-center-between">
      <div
        class="star cursor-pointer"
        v-for="index of 5"
        :key="index"
        @mouseenter="state.hover = index"
        @mouseleave="state.hover = 0"
        @click="selectRating(index)"
      >
        <icon-rating-star
          size="40px"
          :class-list="state.hover >= index || state.select >= index ? 'yellow_filter' : ''"
        ></icon-rating-star>
      </div>
    </div>
    <transition name="fade">
      <div v-if="props.input.error && !data.rating" class="error red">Пожалуйста, оцените мероприятие.</div>
    </transition>
  </div>
</template>

<style scoped lang="scss">
.modal-review {
  gap: 6px;
}
</style>
