<script setup lang="ts">
import { ModalContent } from '@/interfaces/modal/modal.dto';

const emit = defineEmits<{
  (e: 'submitHandler'): void;
  (e: 'cancelHandler'): void;
}>();

defineProps<{
  submitName: ModalContent['submitName'];
  cancelName: ModalContent['cancelName'];
  pending: boolean;
}>();
</script>

<template>
  <div class="modal--actions flex">
    <button v-if="cancelName" class="btn btn-black" @click="emit('cancelHandler')">
      {{ cancelName }}
    </button>
    <button
      v-if="!pending"
      class="btn btn-main btn-max"
      :class="submitName === 'Удалить' ? 'btn--red' : ''"
      @click="emit('submitHandler')"
    >
      {{ submitName }}
    </button>
    <button v-else class="btn btn-main btn-max btn-disabled">Обработка...</button>
  </div>
</template>

<style scoped lang="scss">
.modal--actions {
  gap: 12px;
  button {
    font-size: 16px;
    padding: 12px 32px;
    border-radius: 8px;
  }
}
</style>
