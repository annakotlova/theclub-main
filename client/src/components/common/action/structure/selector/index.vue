<script setup lang="ts">
import { StructureProps } from '@/interfaces/common/structure.dto';
import Opinion from './Opinion.vue';

const emit = defineEmits(['dataManipulation']);

const props = defineProps<{
  input: StructureProps['input'];
  data: StructureProps['data'];
}>();

const isSingleSelector = props.input.type.includes('single');
if (!isSingleSelector && !props.data[props.input.id]?.length) props.data[props.input.id] = [];

const selectOpinion = (opinion: string) => {
  const id = props.input.id;
  if (isSingleSelector) {
    props.data[id] = opinion;
    return emit('dataManipulation');
  }

  if (props.data[id].includes(opinion)) {
    props.data[id] = props.data[id].filter((el: string) => el !== opinion);
    return emit('dataManipulation');
  }

  props.data[id] = [...props.data[id], opinion];
  emit('dataManipulation');
};

const isSelected = (opinion: string) => {
  const el = props.data[props.input.id];
  return Array.isArray(el) ? el.includes(opinion) : el === opinion;
};
</script>

<template>
  <div class="modal-selector flex-column">
    <div class="modal-selector--name fz18">{{ input.name }}</div>
    <div v-if="input.drop" class="modal-selector--container flex flex-ww fz14">
      <opinion
        v-for="opinion of input.drop"
        :key="opinion._id"
        :opinion="opinion"
        :selected="isSelected(opinion._id)"
        @select-opinion="selectOpinion(opinion._id)"
      ></opinion>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal-selector {
  gap: 16px;
  &--container {
    gap: 12px;
  }
}

@media (max-width: 720px) {
  .modal-selector {
    gap: 12px;
    &--name {
      font-size: 16px;
    }
  }
}
</style>
