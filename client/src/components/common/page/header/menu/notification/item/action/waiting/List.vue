<script setup lang="ts">
import { reactive } from 'vue';
import eventAPI from '@/api/event';

const { event, approved } = defineProps<{
  event: string;
  approved?: boolean;
}>();

const state = reactive({
  pending: false,
  approved,
});

const join = async () => {
  if (state.pending) return;

  state.pending = true;
  await eventAPI.actionWaiting(event);
  state.approved = true;
  state.pending = false;
};
</script>

<template>
  <div class="waiting">
    <button
      v-if="state.approved === undefined"
      class="btn btn-notification btn-small"
      @click="join"
    >
      Записаться
    </button>
    <div v-else class="support-result">
      <span class="yellow fz14 fw500">Вы записались на мероприятие</span>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
