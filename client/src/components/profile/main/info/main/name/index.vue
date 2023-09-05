<script setup lang="ts">
defineProps<{
  name: string;
}>();
</script>

<template>
  <div class="name flex flex-ic">
    <div class="fz24 fw500 text text-1">{{ name }}</div>
  </div>
</template>

<style scoped lang="scss">
@media (max-width: 600px) {
  .name {
    div {
      font-size: 20px;
    }
  }
}
</style>
