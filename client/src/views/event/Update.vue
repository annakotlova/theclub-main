<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { EVENT_CREATE_INPUTS } from '@/utils/input/event';
import { commonVerifyInputs } from '@/utils/input/check';
import { useNotificationStore } from '@/store/notification';
import { NOTIFICATION_MESSAGE } from '@/utils/enums/notification';
import { EventCategory } from '@/interfaces/event/event.dto';
import eventAPI from '@/api/event';
import fileAPI from '@/api/file';

import Structure from '@action/structure/index.vue';

const { _id } = defineProps<{
  _id: string;
}>();

const router = useRouter();
const notification = useNotificationStore();

const state = reactive({
  pending: {
    get: true,
    update: false,
  },
});
const form = reactive(EVENT_CREATE_INPUTS());

const validateForm = () => {
  const { status, input, message } = commonVerifyInputs(form);
  if (!status)
    return (
      message &&
      notification.create({
        type: 'error',
        message: NOTIFICATION_MESSAGE.SELECT_DROP_ELEMENT(input?.name),
      })
    );

  update();
};

const update = async () => {
  state.pending.update = true;
  try {
    await eventAPI.update(form.data);
    if (form.data.updatedFile) await updateCover();
  } finally {
    state.pending.update = false;
  }
};

const updateCover = async () => {
  const formData = new FormData();
  formData.append('_id', form.data._id);
  formData.append('cover', form.data.cover);
  formData.append('orientation', String(1));

  await fileAPI.updateEventCover(formData);
};

const manipulationInputs = () => {
  const id = form.data.category === EventCategory.ONLINE ? 'link' : 'place';
  const input = form.inputs.find((i) => i.id === id);
  if (input) input.show = true;
};

const initialData = async () => {
  try {
    const { data } = await eventAPI.getCreatorItem(_id);
    form.data = { ...form.data, ...data };
    manipulationInputs();
  } catch (err) {
    router.push({ name: 'EventList' });
  }
  state.pending.get = false;
};

initialData();
</script>

<template>
  <div class="event-update common-block flex-column">
    <div class="event-update--header fz24 fw500">Редактирование мероприятия</div>
    <div class="event-update--container common-block-b flex-column">
      <transition name="fade">
        <structure v-if="!state.pending.get" :module="form"></structure>
      </transition>
      <div class="action">
        <button v-if="!state.pending.update" class="btn btn-main" @click="validateForm">
          Сохранить изменения
        </button>
        <button v-else class="btn btn-main btn-disabled">Сохранить изменения</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.event-update {
  gap: 24px;
  width: 80%;
  margin: 0 auto;
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
  .event-update {
    width: 90%;
  }
}

@media (max-width: 1000px) {
  .event-update {
    width: 100%;
    padding: 12px;
    border-radius: 12px;
    &--header {
      font-size: 18px;
    }
    &--container {
      padding: 16px;
    }
  }
}
</style>
