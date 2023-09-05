<script setup lang="ts">
import { StructureModule } from '@/interfaces/common/structure.dto';

import StructureInput from './Input.vue';
import { EventCategory } from '@/interfaces/event/event.dto';

const emit = defineEmits(['updatedStructure']);

const { module } = defineProps<{
  module: StructureModule;
  className?: string;
}>();

const dropHandler = (id: string) => {
  module.inputs.filter((input) => input.id !== id).forEach((input) => (input.drop_show = false));
};

const dropManipulation = (id: string) => {
  const data = module.data;
  const inputs = module.inputs;

  if (module.id === 'event-create' && id === 'category') {
    const category = data.category as EventCategory;
    const place = inputs.find((i) => i.id === 'place');
    const link = inputs.find((i) => i.id === 'link');

    if (!place || !link) return;
    place.show = category === EventCategory.OFFLINE;
    link.show = category === EventCategory.ONLINE;
  }
  console.log(data, id);
};

const updateStructure = (id?: string) => {
  emit('updatedStructure');
  if (id) dataManipulation(id);
};

const toggleSwitcher = (id: string) => {
  console.log(id);
};

const dataManipulation = (id: string) => {
  const data = module.data;
  // console.log(data, id);
  // if (id === 'price') emitter.emit(ORDER_EMITTER.SET_PRICE, +data.price);
};
</script>

<template>
  <div class="grid" :class="module.classList">
    <structure-input
      v-for="input of module.inputs"
      :key="input.id"
      :data="module.data"
      :options="module.options"
      :input="input"
      :class-name="className"
      @drop-handler="dropHandler"
      @drop-manipulation="dropManipulation"
      @update-structure="updateStructure"
      @toggle-switcher="toggleSwitcher"
    ></structure-input>
  </div>
</template>

<style scoped lang="scss">
.grid {
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}

@media (max-width: 680px) {
  .grid {
    > div {
      grid-column: 1 / 13 !important;
    }
  }
}
</style>
