<script setup lang="ts">
import IconEventPlus from '@icons/event/plus.vue';
</script>

<template>
  <router-link :to="{ name: 'EventCreate' }" class="event flex flex-ic cursor-pointer black">
    <icon-event-plus size="20px"></icon-event-plus>
    <span class="fz16 fw300">Создать</span>
  </router-link>
</template>

<style scoped lang="scss">
.event {
  background-color: var(--yellow_color);
  border-radius: 12px;
  padding: 12px 18px;
  gap: 8px;
}
</style>
