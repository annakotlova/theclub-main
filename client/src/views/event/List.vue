<script setup lang="ts">
import { Events, onMounted, provide, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useEventStore } from '@/store/event';
import { isSomeEnum } from '@/utils/enums';

import {
  EventCategory,
  EventFilters,
  EventOrganizer,
  EventSort,
} from '@/interfaces/event/event.dto';
import { UserSubject } from '@/interfaces/user/user.dto';
import { CommonQuery } from '@/interfaces/common/index.dto';

import EventsHeader from '@/components/event/header/index.vue';
import EventsContainer from '@/components/event/list/index.vue';
import EventsActions from '@/components/event/actions/index.vue';

const sort = ref('' as EventSort);
const filters = ref({} as EventFilters);
const state = reactive({
  query: {
    page: 1,
    limit: 3,
  } as CommonQuery,
});

const route = useRoute();
const router = useRouter();
const eventStore = useEventStore();

const submitFilters = (data: EventFilters) => {
  state.query.page = 1;
  filters.value = data;
  replaceQuery();
  initialData();
};

const submitSearch = (search: string) => {
  state.query.page = 1;
  state.query.search = search;
  replaceQuery();
  initialData();
};

const submitSort = (data: EventSort) => {
  state.query.page = 1;
  sort.value = data;
  replaceQuery();
  initialData();
};

const pagination = () => {
  state.query.page++;
  initialData(false);
};

provide('filters', filters);
provide('sort', sort);

const replaceQuery = () => {
  router.replace({
    name: 'EventList',
    query: { search: state.query.search as string, sort: sort.value, ...filters.value },
  });
}

const initialData = async (set = true) => {
  await eventStore.getEventList({ ...state.query, sort: sort.value, ...filters.value }, set);
};

onMounted(() => {
  const query = route.query;

  if (isSomeEnum(EventSort)(query.sort)) sort.value = query.sort;
  if (isSomeEnum(UserSubject)(query.subject)) filters.value.subject = query.subject;
  if (isSomeEnum(EventCategory)(query.category)) filters.value.category = query.category;
  if (isSomeEnum(EventOrganizer)(query.organizer)) filters.value.organizer = query.organizer;

  initialData();
});
</script>

<template>
  <section class="events common-block flex-column">
    <events-header
      @submit-filters="submitFilters"
      @submit-sort="submitSort"
      @submit-search="submitSearch"
    ></events-header>
    <events-container></events-container>
    <events-actions
      v-if="state.query.limit * state.query.page < eventStore.total && !eventStore.item"
      @pagination="pagination"
    ></events-actions>
  </section>
</template>

<style scoped lang="scss">
.events {
  gap: 32px;
}

@media (max-width: 720px) {
  .events {
    padding: 16px;
  }
}
</style>
