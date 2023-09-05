<script setup lang="ts">
import { reactive } from 'vue';
import eventAPI from '@/api/event';

const { event, approved } = defineProps<{
  event: string;
  approved?: boolean;
}>();

const state = reactive({
  approved,
});

const approve = async (status: boolean) => {
  await eventAPI.approveSupport({ _id: event, status });
  state.approved = status;
};
</script>

<template>
  <div class="support">
    <div v-if="state.approved === undefined" class="support-approve flex flex-ic">
      <button class="btn btn-notification btn-small" @click="approve(true)">Да</button>
      <button class="btn btn-notification btn-small" @click="approve(false)">Нет</button>
    </div>
    <div v-else class="support-result">
      <span class="yellow fz14 fw500">
        Вы {{ !state.approved ? 'не' : '' }} согласились стать помощником
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.support {
  &-approve {
    gap: 12px;
  }
}
</style>
