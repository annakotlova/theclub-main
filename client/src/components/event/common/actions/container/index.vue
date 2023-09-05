<script setup lang="ts">
import { computed, markRaw, reactive } from 'vue';
import { EventDto, EventStatus } from '@/interfaces/event/event.dto';

import IconPen from '@icons/common/pen.vue';
import IconUserAdd from '@icons/common/userAdd.vue';
import IconTrash from '@icons/common/trash.vue';
import IconCancel from '@icons/common/cancel.vue';

const emit = defineEmits<{
  (e: 'action', id: string): void;
}>();

const { event } = defineProps<{
  event: EventDto;
}>();

const eventIsCreated = event.status === EventStatus.CREATED;
const memberLength = computed(() => event.members.length || 0);

const list = reactive([
  { id: 'edit', show: eventIsCreated, hover: false, name: 'Редактировать', icon: markRaw(IconPen) },
  {
    id: 'support',
    show: memberLength.value >= 25 && eventIsCreated,
    hover: false,
    name: 'Добавить помощника',
    icon: markRaw(IconUserAdd),
  },
  {
    id: 'cancel',
    show: eventIsCreated,
    hover: false,
    name: 'Отменить мероприятие',
    icon: markRaw(IconCancel),
  },
  {
    id: 'delete',
    show: true,
    hover: false,
    name: 'Удалить мероприятие',
    icon: markRaw(IconTrash),
  },
]);
</script>

<template>
  <div class="actions-container flex-column fz14">
    <div
      class="flex flex-ic cursor-pointer"
      v-for="action of list.filter((e) => e.show)"
      :key="action.id"
      @click="emit('action', action.id)"
      @mouseenter="action.hover = true"
      @mouseleave="action.hover = false"
    >
      <component
        size="16px"
        :class-list="action.hover ? 'yellow_filter' : 'white_filter'"
        :is="action.icon"
      ></component>
      <span>{{ action.name }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.actions-container {
  gap: 12px;
  width: 220px;
  padding: 16px;
  border-radius: 16px;
  background-color: var(--black_color);
  div {
    gap: 10px;
    transition: 0.3s all;
    &:hover {
      transition: 0.3s all;
      color: var(--yellow_color);
    }
  }
}
</style>
