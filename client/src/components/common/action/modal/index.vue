<script setup lang="ts">
import { onMounted, onUnmounted, reactive } from 'vue';
import { AxiosRequestConfig } from 'axios';

import { initialContent } from './initial/content';
import { initialInputs } from './initial/inputs';
import { modalRequests } from './initial/requests';
import modalAPI from '@/api/modal';

import { FileDto } from '@/interfaces/file/file.dto';
import { ModalMain, ModalInitial } from '@/interfaces/modal/modal.dto';

import { useModalStore } from '@/store/modal';
import { useGlobalStore } from '@/store/global';
import { useNotificationStore } from '@/store/notification';
import { useEmitter } from '@/use/emitter';

import { NOTIFICATION_MESSAGE } from '@/utils/enums/notification';
import { commonVerifyInputs } from '@/utils/input/check';

import ModalTitle from './title/index.vue';
import ModalContainer from './container/index.vue';
import ModalActions from './actions/index.vue';
import { StructureModule } from '@/interfaces/common/structure.dto';

const emitter = useEmitter();

const modal = useModalStore();
const global = useGlobalStore();
const notification = useNotificationStore();

const state = reactive({
  options: {
    content: initialContent(modal.modal as ModalInitial),
    inputs: { ...initialInputs(modal.modal as ModalInitial), options: { modal: true } },
  } as ModalMain,
});

const options_width = '460px';

const destroyModal = () => {
  modal.destroy();
};

const keyHandler = (event: KeyboardEvent) => {
  if (
    event.key === 'Enter' &&
    !event.shiftKey &&
    !document.querySelector('.common-calendar > .calendar')
  )
    return submitHandler();
  if (event.key === 'Escape') return destroyModal();
};

const collectMainOptions = (): AxiosRequestConfig => ({
  method: state.options.content.method,
  url: `${state.options.content.request}${
    state.options.content.method === 'delete' ? `/${state.options.inputs?.data._id}` : ''
  }`,
  data: state.options.content.method !== 'delete' && state.options.inputs?.data,
});

const collectFileOptions = (formData: FormData, _id: string): AxiosRequestConfig => ({
  method: state.options.content.fileMethod,
  url: state.options.content.fileRequest,
  data: formData,
  headers: { 'Content-Type': 'multipart/form-data' },
  params: { _id },
});

const mainRequest = async () => {
  const options = collectMainOptions();
  const response = await modalAPI.submit(options);
  if (state.options.content.emit) {
    const action = state.options.content.id.split('-').pop();
    emitter.emit(state.options.content.emit, { data: response.data, action: action });
  }
  return response.data._id;
};

const fileTypesRequest = async (_id: string) => {
  const inputs = state.options.inputs as StructureModule;
  const types = inputs.inputs.filter((input) => ['file', 'image', 'images'].includes(input.type));
  const datas = ['cover', 'image', 'attachment'];

  const isInput = types.some((type) => {
    if (Array.isArray(inputs.data[type.id])) {
      return inputs.data[type.id].filter((file: FileDto) => !file._id).length;
    } else {
      return inputs.data[type.id] && !inputs.data[type.id]._id;
    }
  });
  const isData = datas.some((type) => {
    if (Array.isArray(inputs.data[type])) {
      return inputs.data[type].filter((file: FileDto) => !file._id).length;
    } else {
      return inputs.data[type] && !inputs.data[type]._id;
    }
  });

  if (!isInput && !isData) return;

  const formData = new FormData();
  formData.append('_id', _id);

  if (isInput) {
    for (const type of types) {
      if (type.type.includes('images')) {
        const images = inputs.data[type.id].filter((file: FileDto) => !file._id);
        for (const image of images) formData.append(type.id, image);
      } else {
        formData.append(type.id, inputs.data[type.id]);
      }
    }
  }
  if (isData) {
    for (const type of datas) {
      if (type.includes('images')) {
        const images = inputs.data[type].filter((file: FileDto) => !file._id);
        for (const image of images) formData.append(type, image);
      } else {
        formData.append(type, inputs.data[type]);
      }
    }
  }

  const options = collectFileOptions(formData, _id);
  const response = await modalAPI.submit(options);

  emitter.emit(state.options.content.fileEmit || state.options.content.emit || '', {
    data: response.data,
    action: 'file',
  });
};

const manipulationData = () => {
  const data = state.options.inputs?.data;
  if (!data) return;
};

const submitHandler = async () => {
  global.updatePendingStatus(true);

  const check = commonVerifyInputs(state.options.inputs as StructureModule);
  if (!check.status) {
    check.message &&
      notification.create({
        type: 'error',
        message: NOTIFICATION_MESSAGE.SELECT_DROP_ELEMENT(check.input?.name),
      });
    return global.updatePendingStatus(false);
  }
  manipulationData();
  const main = await mainRequest();
  modal.destroy();

  if (state.options.content.fileRequest) await fileTypesRequest(main);
};

modalRequests(state.options);
onMounted(() => {
  document.addEventListener('keyup', keyHandler);
});
onUnmounted(() => {
  document.removeEventListener('keyup', keyHandler);
});
</script>

<template>
  <section class="overlay flex-center" @click="destroyModal">
    <div class="overlay--modal flex-column" @click.stop>
      <modal-title
        v-if="state.options.content.title"
        :title="(state.options.content.title as string)"
        :type="state.options.content.id"
      ></modal-title>
      <modal-container
        v-if="state.options.inputs"
        :inputs="state.options.inputs"
        :content="state.options.content"
      ></modal-container>
      <modal-actions
        v-if="state.options.content.request"
        :pending="global.pending"
        :submit-name="state.options.content.submitName"
        :cancel-name="state.options.content.cancelName"
        @submit-handler="submitHandler"
        @cancel-handler="destroyModal"
      ></modal-actions>
    </div>
  </section>
</template>

<style scoped lang="scss">
.overlay {
  overflow-x: hidden;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 10;
  &--modal {
    margin: 40px 0;
    background: var(--block_color);
    position: relative;
    max-width: 90%;
    width: v-bind('options_width');
    border-radius: 16px;
    padding: 32px;
    z-index: 2;
    gap: 32px;
  }
}

@media (max-width: 680px) {
  .overlay {
    background: rgba(0, 0, 0, 0.7);
    &--modal {
      padding: 24px;
    }
  }
}
</style>
