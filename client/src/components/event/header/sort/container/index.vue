<script setup lang="ts">
import { Ref, inject } from 'vue';
import { EventSort, EventSortName } from '@/interfaces/event/event.dto';

const emit = defineEmits<{
  (e: 'submit', data: EventSort): void;
}>();

const sort = inject<Ref<EventSort>>('sort');
</script>

<template>
  <div class="sort-container common-drop flex-column">
    <div
      class="opinion flex flex-ic cursor-pointer"
      :class="{ yellow: sort === opinion }"
      v-for="opinion in EventSort"
      :key="opinion"
      @click="emit('submit', opinion)"
    >
      <div class="opinion-circle" :class="{ active: sort === opinion }"></div>
      <div class="opinion-name">{{ EventSortName[opinion] }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sort-container {
  gap: 16px;
  padding: 16px;
  .opinion {
    gap: 16px;
    &-circle {
      $px: 16px;
      width: $px;
      height: $px;
      border-radius: $px;
      border: 1px solid var(--white_color);
      transition: 0.3s border;
      &.active {
        transition: 0.3s border;
        border: 2px solid var(--yellow_color);
      }
    }
  }
}

@media (max-width: 720px) {
  .sort-container {
    gap: 16px;
    padding: 16px;
  }
}
</style>
