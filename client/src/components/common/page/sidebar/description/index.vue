<script setup lang="ts">
defineProps<{
  route: string;
  mobile: boolean;
}>();
</script>

<template>
  <div class="description">
    <div v-if="route === 'Profile' && !mobile">
      <span>
        Справа ты найдешь Себя, свою основную команду и календарь событий. Ознакомься, чтобы потом
        не втыкать.
      </span>
    </div>
    <div v-if="route === 'Profile' && mobile">
      <span>
        Снизу ты найдешь Себя, свою основную команду и календарь событий. Ознакомься, чтобы потом не
        втыкать.
      </span>
    </div>

    <div v-if="route === 'EventList' && !mobile">
      <span>тыкай справа и не упусти ничего интересного </span>
    </div>
    <div v-if="route === 'EventList' && mobile">
      <span>чекай ниже и не упусти ничего интересного </span>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
