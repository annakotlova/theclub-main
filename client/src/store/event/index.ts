import { ref } from 'vue';
import { defineStore } from 'pinia';

import { EventDto } from '@/interfaces/event/event.dto';
import { CommonQuery } from '@/interfaces/common/index.dto';

import { updateObject } from '@/utils/global';
import eventAPI from '@/api/event';

export const useEventStore = defineStore('event', () => {
  const list = ref<Array<EventDto>>([]);
  const item = ref<EventDto | null>(null);
  const memberList = ref<Array<EventDto>>([]);

  const total = ref<number>(0);
  const pending = ref<boolean>(false);

  const setList = (data: Array<EventDto>) => (list.value = data);
  const setItem = (data: EventDto) => (item.value = data);

  const create = (data: EventDto) => {
    list.value = [...list.value, data];
    memberList.value = [...memberList.value, data];
  }

  const updateList = (data: Array<EventDto>) => (list.value = [...list.value, ...data]);
  const updateItem = (data: EventDto, once = false, members = false) => {
    const event = list.value.find((event) => event._id === data._id);
    if (event) updateObject(event, data);

    if (data.isMember) memberList.value = [...memberList.value, data];
    else memberList.value = memberList.value.filter((e) => e._id !== data._id);

    if (once && item.value) updateObject(item.value, data);
    if (members && memberList.value.length) getEvent(memberList.value[0]._id);
  };

  const updateSocket = (data: EventDto) => {
    const event = list.value.find((event) => event._id === data._id);
    if (event) updateObject(event, data);

    const eventMember = memberList.value.find((event) => event._id === data._id);
    if (eventMember) updateObject(item, data);

    if (item.value && item.value._id === data._id) updateObject(item.value, data);
  };

  const deleteSocket = (data: EventDto) => {
    list.value = list.value.filter((e) => e._id !== data._id);
    memberList.value = memberList.value.filter((e) => e._id !== data._id);
    if (item.value && item.value._id === data._id) item.value = null;
  };

  const destroyItem = () => (item.value = null);

  const getEvent = async (_id: string) => {
    if (item.value?._id === _id) return;

    const { data } = await eventAPI.getItem(_id);
    setItem(data);
  };
  const getEventList = async (query: CommonQuery, set = false) => {
    if (set) pending.value = true;

    const response = await eventAPI.getList(query);
    total.value = response.total;
    set ? setList(response.data) : updateList(response.data);

    if (set) pending.value = false;
  };
  const getEventListDate = async () => {
    const { data } = await eventAPI.getJoinedList();
    memberList.value = data;
  };

  return {
    list,
    item,
    memberList,
    total,
    pending,

    setList,
    setItem,

    create,

    updateList,
    updateItem,
    updateSocket,

    destroyItem,
    deleteSocket,

    getEvent,
    getEventList,
    getEventListDate,
  };
});
