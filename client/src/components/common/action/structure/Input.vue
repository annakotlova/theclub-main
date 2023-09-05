<script setup lang="ts">
import { defineAsyncComponent, computed } from 'vue';
import { StructureOptions, StructureProps } from '@/interfaces/common/structure.dto';

const DefaultInput = defineAsyncComponent(() => import('./default/index.vue'));
const ModalSubscriptionExtend = defineAsyncComponent(
  () => import('./subscription/extend/index.vue'),
);
const ModalPassword = defineAsyncComponent(() => import('./password/index.vue'));
const ModalSelector = defineAsyncComponent(() => import('./selector/index.vue'));
const ModalSwitcher = defineAsyncComponent(() => import('./switcher/index.vue'));
const ModalUserList = defineAsyncComponent(() => import('./userlist/index.vue'));
const ModalRating = defineAsyncComponent(() => import('./rating/index.vue'));
const ModalQrcode = defineAsyncComponent(() => import('./qrcode/index.vue'));
const ModalImage = defineAsyncComponent(() => import('./image/index.vue'));
const ModalPhone = defineAsyncComponent(() => import('./phone/index.vue'));
const ModalDrop = defineAsyncComponent(() => import('./drop/index.vue'));
const ModalDate = defineAsyncComponent(() => import('./date/index.vue'));
const ModalCode = defineAsyncComponent(() => import('./code/index.vue'));

const emit = defineEmits<{
  (e: 'dropHandler', id: string): void;
  (e: 'toggleSwitcher', id: string): void;
  (e: 'dropManipulation', id: string): void;
  (e: 'updateStructure', id: string): void;
}>();

const props = defineProps<{
  input: StructureProps['input'];
  data: StructureProps['data'];
  options?: StructureOptions;
  className?: string;
}>();

const types = {
  subscriptionExtend: props.input.type === 'subscription-extend',
  selector: props.input.type.includes('selector'),
  userlist: props.input.type.includes('userlist'),
  password: props.input.type === 'password',
  switcher: props.input.type === 'switcher',
  date: props.input.type.includes('date'),
  drop: props.input.type.includes('drop'),
  rating: props.input.type === 'rating',
  qrcode: props.input.type === 'qrcode',
  phone: props.input.type === 'phone',
  image: props.input.type === 'image',
  code: props.input.type === 'code',
};
const styles = computed(() => {
  return { 'grid-column': props.input.grid, 'grid-row': props.input.grid_row };
});
</script>

<template>
  <modal-subscription-extend
    v-if="types.subscriptionExtend && input.show !== false"
    :input="input"
    :data="data"
    :style="styles"
    @toggle-switcher="emit('toggleSwitcher', input.id)"
  ></modal-subscription-extend>
  <modal-rating
    v-else-if="types.rating && input.show !== false"
    :input="input"
    :data="data"
    :style="styles"
  ></modal-rating>
  <modal-user-list
    v-else-if="types.userlist && input.show !== false"
    :input="input"
    :data="data"
    :style="styles"
  ></modal-user-list>
  <modal-qrcode
    v-else-if="types.qrcode && input.show !== false"
    :input="input"
    :data="data"
    :style="styles"
  ></modal-qrcode>
  <modal-switcher
    v-else-if="types.switcher && input.show !== false"
    :input="input"
    :data="data"
    :style="styles"
    @toggle-switcher="emit('toggleSwitcher', input.id)"
  ></modal-switcher>
  <modal-selector
    v-else-if="types.selector && input.show !== false"
    :input="input"
    :data="data"
    :style="styles"
    @data-manipulation="emit('updateStructure', input.id)"
  ></modal-selector>
  <modal-phone
    v-else-if="types.phone && input.show !== false"
    :input="input"
    :data="data"
    :style="styles"
  ></modal-phone>
  <modal-code
    v-else-if="types.code && input.show !== false"
    :input="input"
    :data="data"
    :style="styles"
  ></modal-code>
  <modal-password
    v-else-if="types.password && input.show !== false"
    :input="input"
    :data="data"
    :style="styles"
    :class-name="className"
  ></modal-password>
  <modal-image
    v-else-if="types.image && input.show !== false"
    :input="input"
    :data="data"
    :style="styles"
  ></modal-image>
  <modal-drop
    v-else-if="types.drop && input.show !== false"
    :input="input"
    :data="data"
    :style="styles"
    @drop-handler="emit('dropHandler', input.id)"
    @drop-manipulation="emit('dropManipulation', input.id)"
  ></modal-drop>
  <modal-date
    v-else-if="types.date && input.show !== false"
    :input="input"
    :data="data"
    :style="styles"
    :class-name="className"
  ></modal-date>
  <default-input
    v-else-if="input.show !== false"
    :input="input"
    :data="data"
    :is-modal="!!options?.modal"
    :class-name="className"
    :style="styles"
    @data-manipulation="emit('updateStructure', input.id)"
  ></default-input>
</template>

<style scoped lang="scss"></style>
