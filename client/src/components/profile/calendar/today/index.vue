<script setup lang="ts">
import { computed, reactive } from 'vue';
import { EventDto } from '@/interfaces/event/event.dto';
import { useGlobalStore } from '@/store/global';
import { useEventStore } from '@/store/event';
import { useModalStore } from '@/store/modal';
import { openLink } from '@/utils/global';
import dateFilter from '@/filters/date.filter';
import eventAPI from '@/api/event';

import EventCounter from './counter/index.vue';
import EventContainer from './container/index.vue';
import EventCommonNext from '@/components/event/common/next/index.vue';

const emit = defineEmits<{
  (e: 'selectDate', date: Date): void;
}>();

const props = defineProps<{
  events: Array<EventDto>;
  nextEvent?: EventDto;
  dates: {
    date: Date;
    today: Date;
  };
}>();

const state = reactive({
  pending: {
    action: false,
  },
});

const modal = useModalStore();
const global = useGlobalStore();
const eventStore = useEventStore();
const eventItem = computed(() => eventStore.item);

const currentDate = computed(() =>
  +props.dates.date === +props.dates.today ? 'сегодня' : dateFilter(props.dates.date),
);

const selectEvent = async (_id: string) => {
  await eventStore.getEvent(_id);
};

const eventLink = () => {
  const item = eventItem.value;
  if (!item || !item.link) return;
  openLink(item.link, '_blank');
};

const eventQrcode = () => {
  const item = eventItem.value;
  if (!item || !item.qrcode) return;
  modal.create({
    id: 'event-qrcode',
    data: { name: item.name, qrcode: item.qrcode, startedAt: item.startedAt },
  });
};

const eventAction = async () => {
  const item = eventItem.value;
  if (!item || state.pending.action) return;

  state.pending.action = true;
  try {
    const { data } = await eventAPI.action(item._id);
    eventStore.updateItem(data, true, true);
  } finally {
    state.pending.action = false;
  }
};
</script>

<template>
  <div
    class="event-today flex-column"
    :class="{ 'flex-jc': !events.length, mobile: global.isMobile }"
  >
    <div v-if="!events.length" class="event-today-empty text-center">
      На {{ currentDate }} мероприятий нет!
    </div>
    <template v-else>
      <template v-if="events.length > 1">
        <event-counter
          :events="events"
          :selected="eventItem?._id"
          @select-event="selectEvent"
        ></event-counter>
        <div class="separator"></div>
      </template>
      <event-container
        v-if="eventItem"
        :event="eventItem"
        @event-action="eventAction"
        @event-qrcode="eventQrcode"
        @event-link="eventLink"
      ></event-container>
    </template>
    <template v-if="nextEvent">
      <event-common-next
        :event="nextEvent"
        @select-date="emit('selectDate', nextEvent.startedAt)"
      ></event-common-next>
    </template>
  </div>
</template>

<style scoped lang="scss">
.event-today {
  width: 340px;
  position: absolute;
  z-index: 1;
  left: -36px;
  top: 36px;
  height: calc(100% - 72px);
  background: rgba(14, 14, 14, 0.9);
  box-shadow: 10px 0px 30px rgba(3, 3, 3, 0.4);
  backdrop-filter: blur(6px);
  border-radius: 24px;
  padding: 16px;
  .separator {
    margin: 16px 0;
    width: 100%;
    height: 1px;
    background-color: var(--gray_color);
  }
  &.mobile {
    width: 100%;
    padding: 0;
    position: static;
  }
}

@media (max-width: 1500px) {
  .event-today {
    width: 270px;
  }
}
</style>
