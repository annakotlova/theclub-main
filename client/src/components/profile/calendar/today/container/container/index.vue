<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { EventCategory, EventDto, EventOrganizer } from '@/interfaces/event/event.dto';

import ReadMore from '@action/readMore/index.vue';
import EventCommonName from '@/components/event/common/name/index.vue';
import EventCommonDate from '@/components/event/common/date/index.vue';
import EventCommonPeriod from '@/components/event/common/period/index.vue';
import EventCommonMembers from '@/components/event/common/members/index.vue';
import EventCommonOptions from '@/components/event/common/options/index.vue';
const EventCommonPlace = defineAsyncComponent(
  () => import('@/components/event/common/place/index.vue'),
);

const { event } = defineProps<{
  event: EventDto;
}>();

const isOffline = computed(() => event.category === EventCategory.OFFLINE);
</script>

<template>
  <div class="container flex-column">
    <event-common-name
      :name="event.name"
      :is-club="event.organizer === EventOrganizer.CLUB"
    ></event-common-name>
    <event-common-period
      class="fz12"
      :started-at="event.startedAt"
      :ended-at="event.endedAt"
    ></event-common-period>
    <read-more v-if="event.content" class="fz14" :length="140" :text="event.content"></read-more>
    <event-common-options
      class="container-options fz12"
      :subject="event.subject"
      :category="event.category"
    ></event-common-options>
    <div class="container-footer flex flex-ic flex-ww fz14 fw200 yellow">
      <event-common-members
        :members="event.members.length"
        :max="event.maxMembers"
      ></event-common-members>
      <event-common-date
        :started-at="event.startedAt"
        :ended-at="event.endedAt"
      ></event-common-date>
      <event-common-place v-if="isOffline" :place="event.place"></event-common-place>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  gap: 8px;
  &-content {
    line-height: 130%;
  }
  &-options {
    margin-bottom: 8px;
    gap: 8px;
  }
  &-footer {
    gap: 12px;
    > div {
      gap: 6px;
    }
  }
}
</style>
