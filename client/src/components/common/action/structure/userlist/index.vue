<script setup lang="ts">
import { computed } from 'vue';
import { StructureProps } from '@/interfaces/common/structure.dto';
import { UserDto } from '@/interfaces/user/user.dto';

import UserItem from './item/index.vue';

const { data } = defineProps<{
  input: StructureProps['input'];
  data: StructureProps['data'];
}>();

const list = computed<Array<UserDto>>(() => data.list);

const isSelected = (_id: string) => {
  return !!data.selected.find((s: string) => s === _id);
};

const select = (user: UserDto) => {
  if (isSelected(user._id)) data.selected = data.selected.filter((s: string) => s !== user._id);
  else data.selected = [...data.selected, user._id];
};
</script>

<template>
  <div class="modal-userlist">
    <user-item
      v-for="user of list"
      :key="user._id"
      :user="user"
      :is-selected="isSelected(user._id)"
      @click="select(user)"
    ></user-item>
  </div>
</template>

<style scoped lang="scss">
.modal-userlist {
  max-height: 320px;
  overflow: auto;
  > div {
    &:not(:last-child) {
      border-bottom: 1px solid var(--darkborder_color);
    }
  }
}
</style>
