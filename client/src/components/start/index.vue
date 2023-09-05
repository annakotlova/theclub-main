<script setup lang="ts">
defineProps<{
  place: { name: string; description: string; coming: boolean };
}>();
</script>

<template>
  <div class="place cursor-pointer flex-column text-center" :class="{ 'gray': place.coming, 'yellow': !place.coming }">
    <div class="place-name fz32 fw600">
      {{ place.name }}
    </div>
    <div class="place-description fz24">
      <span>{{ place.description }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.place {
  width: 45%;
  gap: 24px;
  padding: 32px;
  border-radius: 12px;
  transition: 0.3s all;
  background-color: var(--black_color);
  &.yellow:hover {
    color: var(--black_color);
    transform: scale(1.025);
    transition: 0.3s all;
    background-color: var(--yellow_color);
    box-shadow: 0px 0px 60px rgba(172, 157, 6, 0.5);
  }
}

@media (max-width: 1100px) {
  .place {
    padding: 24px;
    &-name {
      font-size: 24px;
    }
    &-description {
      font-size: 20px;
    }
  }
}

@media (max-width: 680px) {
  .place {
    width: 100%;
  }
}
</style>
