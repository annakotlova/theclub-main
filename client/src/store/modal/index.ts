import { ref } from 'vue';
import { defineStore } from 'pinia';
import { ModalInitial } from '@/interfaces/modal/modal.dto';

export const useModalStore = defineStore('modal', () => {
  const modal = ref<ModalInitial | null>(null);

  const create = (data: ModalInitial) => {
    modal.value = data;
  };

  const destroy = () => {
    modal.value = null;
  };

  return {
    modal,
    create,
    destroy,
  };
});
