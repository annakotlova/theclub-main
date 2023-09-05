<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { EventDto, EventCategory } from '@/interfaces/event/event.dto';
import { useUserStore } from '@/store/user';
import { useModalStore } from '@/store/modal';

import Action from './action/index.vue';
import EventCommonDate from '@/components/event/common/date/index.vue';
import EventCommonMembers from '@/components/event/common/members/index.vue';
const EventCommonPlace = defineAsyncComponent(
  () => import('@/components/event/common/place/index.vue'),
);

const emit = defineEmits<{
  (e: 'eventAction'): void;
}>();

const { event } = defineProps<{
  event: EventDto;
}>();

const user = useUserStore();
const modal = useModalStore();
const isCreator = computed(() => user.user?._id === event.creator._id);
const isOffline = computed(() => event.category === EventCategory.OFFLINE);

const eventQrcode = () => {
  if (!event.qrcode) return;
  modal.create({
    id: 'event-qrcode',
    data: { name: event.name, qrcode: event.qrcode, startedAt: event.startedAt },
  });
};
</script>

<template>
  <footer class="event-footer flex-center-between flex-ww">
    <div class="event-footer--info flex flex-ww flex-ic fw300 yellow">
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
    <action
      v-if="!isCreator"
      :event="event"
      @event-qrcode="eventQrcode"
      @event-action="emit('eventAction')"
    ></action>
  </footer>
</template>

<style scoped lang="scss">
.event-footer {
  gap: 24px;
  &--info,
  &--action {
    gap: 24px;
  }
}

@media (max-width: 1120px) {
  .event-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    &--action {
      align-self: flex-end;
    }
  }
}

@media (max-width: 720px) {
  .event-footer {
    gap: 32px;
    &--action {
      width: 100%;
    }
  }
}
</style>
