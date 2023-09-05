<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { SidebarList } from '@/interfaces/common/sidebar.dto';
import { useGlobalStore } from '@/store/global';

import SidebarDescription from './description/index.vue';
const EventCalendar = defineAsyncComponent(() => import('@/components/event/calendar/index.vue'));

const route = useRoute();
const global = useGlobalStore();
const sidebar = computed(() => SidebarList[route.name as keyof typeof SidebarList]);
</script>

<template>
  <aside v-if="sidebar" class="sidebar flex-column black" :class="route.meta.id">
    <div class="sidebar-container flex-column">
      <div class="name">{{ sidebar?.name }}</div>
      <sidebar-description
        :route="String(route.name)"
        :mobile="global.isMobile"
      ></sidebar-description>
    </div>
    <event-calendar v-if="route.name === 'EventList' && !global.isMobile"></event-calendar>
  </aside>
</template>

<style scoped lang="scss">
.sidebar {
  min-width: 270px;
  max-width: 17.5%;
  gap: 64px;
  &-container {
    gap: 16px;
    .name {
      line-height: 1;
      word-break: break-word;
      text-transform: uppercase;
      font-size: 98px;
      font-weight: 900;
    }
    .description {
      text-transform: uppercase;
    }
  }
}

@media (max-width: 1680px) {
  .sidebar {
    &-container {
      .name {
        font-size: 94px;
      }
    }
  }
}

@media (max-width: 960px) {
  .sidebar {
    max-width: 100%;
    width: 100%;
    &-container {
      .name {
        font-size: 140px;
      }
    }
  }
}

@media (max-width: 600px) {
  .sidebar {
    &-container {
      .name {
        font-size: 84px;
      }
    }
  }
}

@media (max-width: 440px) {
  .sidebar {
    &-container {
      .name {
        font-size: 56px;
      }
    }
  }
}
</style>
