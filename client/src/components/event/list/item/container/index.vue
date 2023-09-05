<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { EventDto, EventOrganizer } from '@/interfaces/event/event.dto';

import Media from '@/plugins/media/index.vue';
import ReadMore from '@action/readMore/index.vue';
import EventCommonName from '@/components/event/common/name/index.vue';
import EventCommonPeriod from '@/components/event/common/period/index.vue';
import EventCommonOptions from '@/components/event/common/options/index.vue';
const EventCommonAdditional = defineAsyncComponent(
  () => import('@/components/event/common/additional/index.vue'),
);

defineProps<{
  event: EventDto;
}>();
</script>

<template>
  <section class="event-container flex-column">
    <div v-if="event.cover" class="event-container--cover">
      <media :image="event.cover"></media>
    </div>
    <div class="event-container--wrapper flex-column">
      <event-common-name
        :name="event.name"
        :is-club="event.organizer === EventOrganizer.CLUB"
      ></event-common-name>
      <event-common-period
        :started-at="event.startedAt"
        :ended-at="event.endedAt"
      ></event-common-period>
      <read-more v-if="event.content" :length="300" :text="event.content"></read-more>
      <event-common-options
        :format="event.format"
        :subject="event.subject"
        :category="event.category"
      ></event-common-options>
      <event-common-additional
        v-if="event.additional"
        :additional="event.additional"
      ></event-common-additional>
    </div>
  </section>
</template>

<style scoped lang="scss">
.event-container {
  gap: 24px;
  &--cover {
    width: 100%;
    aspect-ratio: 1 / 0.33;
    border-radius: 12px;
  }
  &--wrapper {
    gap: 8px;
  }
}

@media (max-width: 720px) {
  .event-container {
    &--cover {
      aspect-ratio: 1 / 0.45;
    }
    &--wrapper {
      .name {
        font-size: 20px;
      }
    }
  }
}
</style>
