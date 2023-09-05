<script setup lang="ts">
import { useRouter } from 'vue-router';

import StartItem from '@/components/start/index.vue';

const router = useRouter();
const selectPlace = (route: string) => {
  if (route === 'EventList') return;
  
  router.push({ name: route });
};

const places = [
  {
    name: 'Мероприятия',
    description: 'Скоро появятся.',
    route: 'EventList',
    coming: true,
  },
  {
    name: 'Профиль',
    description: 'Здесь твой профиль, посмотри чтобы потом не втыкать.',
    route: 'Profile',
    coming: false,
  },
];
</script>

<template>
  <section class="start flex-column">
    <div class="start-description text-center fz32 fw700">
      <div>Выбери место, откуда хочешь начать пользование сервисом</div>
    </div>
    <div class="start-container flex flex-jb">
      <start-item
        v-for="place of places"
        :key="place.route"
        :place="place"
        @click="selectPlace(place.route)"
      ></start-item>
    </div>
  </section>
</template>

<style scoped lang="scss">
.start {
  width: 70%;
  gap: 72px;
  &-description {
    text-transform: uppercase;
  }
}

@media (max-width: 1100px) {
  .start {
    width: 90%;
    gap: 48px;
    &-description {
      font-size: 24px;
    }
  }
}

@media (max-width: 680px) {
  .start {
    width: 100%;
    gap: 32px;
    &-container {
      flex-direction: column;
      gap: 32px;
    }
  }
}
</style>
