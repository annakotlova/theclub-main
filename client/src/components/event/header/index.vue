<script setup lang="ts">
import { computed, defineAsyncComponent, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { EventFilters, EventSort } from '@/interfaces/event/event.dto';
import { useEventStore } from '@/store/event';
import { useGlobalStore } from '@/store/global';

import Sort from './sort/index.vue';
import Filters from './filters/index.vue';
import CommonSearch from '@action/input/Search.vue';
import IconCommonCancel from '@icons/common/cancel.vue';
const EventCalendarMobile = defineAsyncComponent(
  () => import('@/components/event/calendar/Mobile.vue'),
);

const router = useRouter();
const global = useGlobalStore();
const eventStore = useEventStore();
const event = computed(() => eventStore.item);

const emit = defineEmits<{
  (e: 'submitSearch', search: string): void;
  (e: 'submitFilters', data: EventFilters): void;
  (e: 'submitSort', data: EventSort): void;
}>();

const state = reactive({
  search: '',
  showSearch: false,
});

const blurSearch = () => {
  if (!global.isMobile) return;
  state.showSearch = false;
};

const focusSearch = () => {
  if (!global.isMobile) return;
  state.showSearch = true;
};

const createEvent = () => {
  router.push({ name: 'EventCreate' });
};
</script>

<template>
  <header class="events-header flex-column">
    <template v-if="!event">
      <div
        v-if="!event"
        class="options flex-center-between"
        :class="{ 'mobile flex-je': global.isMobile }"
      >
        <transition name="fade">
          <div v-if="!state.showSearch" class="options-main flex flex-ic">
            <filters @submit-filters="(d) => emit('submitFilters', d)"></filters>
            <event-calendar-mobile v-if="global.isMobile"></event-calendar-mobile>
            <sort @submit-sort="(d) => emit('submitSort', d)"></sort>
          </div>
        </transition>
        <common-search
          v-model="state.search"
          @on-blur="blurSearch"
          @on-focus="focusSearch"
          @click-handler="emit('submitSearch', state.search)"
        ></common-search>
      </div>
      <div v-if="global.isMobile" class="actions">
        <button class="btn btn-main btn-max" @click="createEvent">
          Создать мероприятие
        </button>
      </div>
    </template>
    <div v-else class="item yellow flex flex-ic cursor-pointer" @click="eventStore.destroyItem">
      <span class="text text-1">{{ event.name }}</span>
      <icon-common-cancel class-list="yellow_filter"></icon-common-cancel>
    </div>
  </header>
</template>

<style scoped lang="scss">
header {
  gap: 24px;
  .options {
    gap: 16px;
    &-main {
      gap: inherit;
    }

    &.mobile {
      .search {
        width: 100%;
      }
    }
  }
  .item {
    max-width: 240px;
    gap: 6px;
  }
}
</style>
