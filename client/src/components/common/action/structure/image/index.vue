<script setup lang="ts">
import { computed, ref } from 'vue';
import { StructureProps } from '@/interfaces/common/structure.dto';
import { checkFileSize, checkFileType } from '@/utils/global/file';
import { useGlobalStore } from '@/store/global';

import Media from '@/plugins/media/index.vue';
import IconCommonImage from '@icons/common/image.vue';

const props = defineProps<{
  input: StructureProps['input'];
  data: StructureProps['data'];
}>();

const global = useGlobalStore();

const classList = computed(() => {
  return { error: props.input.error };
});

props.data.updatedFile = false;

const file = ref<null | HTMLInputElement>(null);
const uploadHandler = () => {
  if (!file.value || !file.value.files) return;
  const file_list = Array.from(file.value.files);

  if (!checkFileSize(file_list)) return;
  if (!checkFileType(file_list[0], 'image')) return;

  props.data[props.input.id] = file_list[0];
  props.data.updatedFile = true;
};

const styles = computed(() => ({
  'border-width': props.data[props.input.id] ? 0 : 'thin',
}));
</script>

<template>
  <div class="modal-image">
    <div v-if="input.name" class="common-input--name">
      <span class="fz16">{{ input.name }}</span>
    </div>
    <label class="modal-image--container flex-center" :style="styles" :class="classList">
      <media v-if="data[input.id]" :image="data[input.id]"></media>
      <div v-else class="empty flex-column flex-center text-center">
        <icon-common-image :size="global.isMobile ? '60px' : '120px'"></icon-common-image>
        <span class="fz12 gray">Изображение должно быть в формате PNG, JPEG, WEBP.</span>
        <span class="fz12 gray">Изображение не должно превышать 25 МБ.</span>
      </div>
      <input type="file" ref="file" name="image" @change="uploadHandler" />
    </label>
  </div>
</template>

<style scoped lang="scss">
.modal-image {
  &--container {
    position: relative;
    border: 1px solid var(--border_color);
    border-radius: 6px;
    width: 100%;
    aspect-ratio: 1 / 0.3;
    &.error {
      transition: 0.3s all;
      border-color: var(--red_color);
    }
    img,
    .empty {
      width: 100%;
      height: 100%;
      border-radius: inherit;
    }
    .empty {
      gap: 8px;
      padding: 0 12px;
      min-height: 160px;
    }
  }
}
</style>
