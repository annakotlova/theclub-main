<script setup lang="ts">
import { computed, reactive } from 'vue';
import { MediaProps } from './typings/media';
import { sizes, orientations } from './helper';
import { FileDto } from '../../interfaces/file/file.dto';

const emit = defineEmits(['loadedMedia']);

const props = defineProps<{
  image: MediaProps['image'];
  resize?: boolean;
  natural?: boolean;
  type?: 'large' | 'main' | 'medium' | 'small' | 'verysmall';
  color?: string;
}>();

const lazyOptions = reactive({
  lifecycle: {
    loading: (el: HTMLImageElement) => {
      if (!props.natural) return;
      el.onload = () => emit('loadedMedia', el);
    },
    loaded: (el: HTMLImageElement) => {
      if (!props.natural) return;
      emit('loadedMedia', el);
    },
  },
});

const FILE_URL = import.meta.env.VITE_URL;

const previewImage = () => {
  if (typeof props.image === 'string') return props.image;
  return URL.createObjectURL(props.image as File);
};

const currentSizeType = () => {
  if (props.type) return sizes.find((size) => size.type === props.type) || sizes[1];
  return sizes.find((size) => size.min_width < window.innerWidth) || sizes[1];
};

const styles = computed(() => {
  const image = props.image as FileDto;
  const orientation = image.meta?.orientation || '-1';
  const type = orientations[orientation];
  const transform = `rotate(${type?.rotate || 0}deg) scaleY(${type?.scale || 1})`;
  return { transform };
});

const coverSource = computed(() => {
  return (props.image as FileDto)._id ? FILE_URL + (props.image as FileDto).cover : previewImage();
});

const mainSourse = computed(() => {
  const image = props.image as FileDto;
  if (!image._id) return previewImage();
  if (!props.resize) return FILE_URL + image.src;
  return FILE_URL + image.src.replace('_main_', `_${currentSizeType()?.type}_`);
});
</script>

<template>
  <img
    v-if="image"
    v-lazy="{
      src: mainSourse,
      loading: coverSource,
      error: '/images/common/default_image.webp',
      lifecycle: lazyOptions.lifecycle,
    }"
    alt="Image"
    :style="styles"
  />
  <div class="flex-center" v-else>
    <img src="/images/common/default_image.webp" alt="Image" />
  </div>
</template>

<style scoped lang="scss">
img,
video,
.flex-center {
  object-fit: cover;
  pointer-events: none;
  width: 100%;
  height: 100%;
  border-radius: inherit;
  aspect-ratio: inherit;
}
.flex-center {
  background-color: var(--block_color);
  svg {
    width: 20px;
    height: 20px;
  }
}
</style>
