<script setup lang="ts">
import {
  EventCategoryName,
  EventCategory,
  EventFormat,
  EventFormatName,
} from '@/interfaces/event/event.dto';
import { UserSubjectName, UserSubject } from '@/interfaces/user/user.dto';

defineProps<{
  format?: EventFormat;
  subject: UserSubject;
  category: EventCategory;
}>();
</script>

<template>
  <div class="event-common-options flex flex-ic flex-ww gray fw300 fz14">
    <div v-if="format" class="options gray">{{ EventFormatName[format] }}</div>
    <div class="options gray">{{ UserSubjectName[subject] }}</div>
    <div class="options gray">{{ EventCategoryName[category] }}</div>
  </div>
</template>

<style scoped lang="scss">
.event-common-options {
  gap: 16px;
  margin-top: 8px;
  .options {
    padding: 8px;
    border-radius: 4px;
    background-color: var(--black_color);
  }
}
</style>
