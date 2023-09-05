<script setup lang="ts">
import { onMounted, onUnmounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { EVENT_CREATE_INPUTS } from '@/utils/input/event';
import { commonVerifyInputs } from '@/utils/input/check';
import { useNotificationStore } from '@/store/notification';
import { EventDto } from '@/interfaces/event/event.dto';
import { useModalStore } from '@/store/modal';
import { NOTIFICATION_MESSAGE } from '@/utils/enums/notification';
import { useEmitter } from '@/use/emitter';
import { useEventStore } from '@/store/event';

import Structure from '@action/structure/index.vue';

const router = useRouter();
const emitter = useEmitter();
const modal = useModalStore();
const event = useEventStore();
const notification = useNotificationStore();
const form = reactive(EVENT_CREATE_INPUTS());

const create = () => {
  const { status, input, message } = commonVerifyInputs(form);
  if (!status)
    return (
      message &&
      notification.create({
        type: 'error',
        message: NOTIFICATION_MESSAGE.SELECT_DROP_ELEMENT(input?.name),
      })
    );

  modalCreate();
};

const modalCreate = () => {
  modal.create({ id: 'event-create', data: form.data });
};

const eventAction = ({ data, action }: { data: EventDto; action: string }) => {
  if (action === 'create') event.create(data);
  router.push({ name: 'EventList' });
};

onMounted(() => {
  emitter.on('event-action', eventAction);
});

onUnmounted(() => {
  emitter.off('event-action');
});
</script>

<template>
  <div class="event-create flex-column common-block">
    <div class="event-create--header fz24 fw500">Создание мероприятия</div>
    <div class="event-create--container common-block-b flex-column">
      <structure :module="form"></structure>
      <div class="action">
        <button class="btn btn-main" @click="create">Создать мероприятие</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.event-create {
  width: 80%;
  margin: 0 auto;
  gap: 24px;
  &--header {
    font-size: 18px;
  }
  &--container {
    gap: 80px;
    .action {
      width: 100%;
      button {
        width: inherit;
      }
    }
  }
}

@media (max-width: 1280px) {
  .event-create {
    width: 90%;
  }
}

@media (max-width: 1000px) {
  .event-create {
    width: 100%;
    padding: 12px;
    border-radius: 12px;
    &--container {
      padding: 16px;
    }
  }
}
</style>
