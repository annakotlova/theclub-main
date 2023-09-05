<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useModalStore } from '@/store/modal';
import { EventDto } from '@/interfaces/event/event.dto';

import IconDots from '@icons/common/dots.vue';
import CommonDrop from '@action/drop/index.vue';
const ActionsContainer = defineAsyncComponent(() => import('./container/index.vue'));

const { event } = defineProps<{
  event: EventDto;
}>();

const router = useRouter();
const modal = useModalStore();

const action = (id: string) => {
  if (id === 'edit') return router.push({ name: 'EventUpdate', params: { _id: event._id } });
  else modal.create({ id: `event-${id}`, data: { _id: event._id, name: event.name } });
};
</script>

<template>
  <div class="actions">
    <common-drop element=".actions" :container="{ top: '0px', right: '-4px' }">
      <template #header>
        <div class="actions-header cursor-pointer">
          <icon-dots size="40px" class-list="yellow_filter"></icon-dots>
        </div>
      </template>
      <template #container>
        <actions-container :event="event" @action="action"></actions-container>
      </template>
    </common-drop>
  </div>
</template>

<style scoped lang="scss"></style>
