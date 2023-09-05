<script setup lang="ts">
import { useModalStore } from '@/store/modal';

const { event } = defineProps<{
  event: string;
}>();

const modal = useModalStore();
const onReview = () => {
  modal.create({ id: 'review-create', data: { event } });
};
</script>

<template>
  <div class="review flex flex-ic">
    <button class="btn btn-notification btn-small" @click="onReview">Оставить отзыв</button>
  </div>
</template>

<style scoped lang="scss">
.review {
  gap: 12px;
}
</style>
