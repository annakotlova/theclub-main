<script setup lang="ts">
import { reactive } from 'vue';
import { StructureProps } from '@/interfaces/common/structure.dto';
import dateFilter from '@/filters/date.filter';

import CommonCalendar from '@action/calendar/index.vue';

const { input, data } = defineProps<{
  input: StructureProps['input'];
  data: StructureProps['data'];
  className?: string;
}>();

const state = reactive({
  date: data[input.id] ? dateFilter(data[input.id], input.type) : '',
});

const currentDate = () => {
  if (!state.date) return (data[input.id] = '');

  if (input.type === 'date') return date();
  if (input.type === 'datetime') return dateTimeYear();
};

const date = () => {
  const date = state.date.split('.') || [];

  const _date = new Date(`${date[1]}/${date[0]}/${date[2]}`);
  data[input.id] = _date;
};

const selectDate = (d: Date) => {
  data[input.id] = d;
};

const dateTimeYear = () => {
  const day = state.date.split(' | ');
  const date = day[0]?.split('.') || [];
  const time = day[1]?.split(':') || [];

  const _date = new Date(`${date[1]}/${date[0]}/${date[2]} ${time[0]}:${time[1]}`);
  data[input.id] = _date;
};
</script>

<template>
  <div class="modal-date common-input flex-column" :class="className">
    <div class="common-input--name" :class="className">{{ input.name }}</div>
    <common-calendar :started-at="data[input.id]" :time="input.type === 'datetime'" :class-name="className" @apply="selectDate"></common-calendar>
    <!-- <common-input
      class="common-calendar--input"
      v-model="state.date"
      type="input"
      :class="{ icon: !!input.icon }"
      :className="className"
      :mask="input.mask"
      :placeholder="input.placeholder"
      @keyup="currentDate"
    /> -->
  </div>
</template>

<style scoped lang="scss">
.modal-date {
  position: relative;
  &.black {
    img {
      bottom: 12px;
      width: 20px;
      height: 20px;
    }
  }
}
</style>
