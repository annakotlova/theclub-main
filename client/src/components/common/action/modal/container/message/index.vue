<script setup lang="ts">
import { StructureModule } from '@/interfaces/common/structure.dto';
import { ModalContent } from '@/interfaces/modal/modal.dto';

const props = defineProps<{
  message: ModalContent['message'];
  action: ModalContent['action'];
  data: StructureModule['data'];
}>();

const isDeleteAction = props.action === 'delete';
</script>

<template>
  <div class="message">
    <div v-if="isDeleteAction">
      <span>Вы действительно хотите {{ message }}</span>
      <span v-if="data.name" class="fw500"> "{{ data.name }}"</span>
      <span>?</span>
    </div>
    <div v-else>
      {{ message }}
    </div>
  </div>
</template>

<style scoped lang="scss">
.message {
  div {
    line-height: 130%;
    white-space: pre-line;
  }
}
</style>
