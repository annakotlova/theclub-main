<script setup lang="ts">
import { ModalContent } from '@/interfaces/modal/modal.dto';
import { StructureModule } from '@/interfaces/common/structure.dto';

import PreloaderCircle from '@page/preloader/Circle.vue';
import Structure from '@action/structure/index.vue';
import Message from './message/index.vue';

const props = defineProps<{
  inputs: StructureModule;
  content: ModalContent;
}>();

const isMessageAction = props.content.action === 'delete' || !props.inputs.inputs.length;
</script>

<template>
  <div class="modal--container fz14">
    <suspense>
      <template #default>
        <structure v-if="!isMessageAction" :module="inputs" className="black"></structure>
        <message
          v-else
          :action="content.action"
          :message="content.message"
          :data="inputs.data"
        ></message>
      </template>
      <template #fallback>
        <preloader-circle :scale="1"></preloader-circle>
      </template>
    </suspense>
  </div>
</template>

<style scoped lang="scss">
.modal--container {
  flex: 1 1 auto;
}
</style>
