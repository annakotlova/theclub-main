<script setup lang="ts">
import { CardDto } from '@/interfaces/card/card.dto';

import CommonDrop from '@action/drop/index.vue';
import IconArrowRight from '@icons/arrow/right.vue';

const emit = defineEmits<{
  (e: 'deleteCard'): void;
}>();

defineProps<{
  card: CardDto;
}>();
</script>

<template>
  <div class="card gray">
    <common-drop element=".card" :container="{ top: '120%', left: '0px' }">
      <template #header="{ show }">
        <div class="card-title flex flex-ic cursor-pointer">
          <span>{{ card.tinkoff.Pan }}</span>
          <icon-arrow-right size="20px" :class="{ show }"></icon-arrow-right>
        </div>
      </template>
      <template #container>
        <ul class="card-container text-center">
          <li class="cursor-pointer" @click="emit('deleteCard')">Отвязать карту</li>
        </ul>
      </template>
    </common-drop>
  </div>
</template>

<style scoped lang="scss">
.card {
  position: relative;
  &-title {
    gap: 12px;
    img {
      transition: 0.3s transform;
      transform: rotate(90deg);
      &.show {
        transition: 0.3s transform;
        transform: rotate(-90deg);
      }
    }
  }
  &-container {
    width: 150px;
    border-radius: 8px;
    background-color: var(--black_color);
    position: absolute;
    padding: 12px;
    li {
      transition: 0.3s all;
      &:hover {
        transition: 0.3s all;
        color: var(--white_color);
      }
    }
  }
}
</style>
