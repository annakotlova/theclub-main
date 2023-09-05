<script setup lang="ts"></script>

<template>
  <div class="preloader flex-center">
    <div class="lds">
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.preloader {
  width: 100%;
  padding: 24px;
  border-radius: 16px;
  background-color: var(--block_color);
}
.lds {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds div {
  display: inline-block;
  position: absolute;
  left: 8px;
  width: 16px;
  background: var(--yellow_color);
  animation: lds 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
}
.lds div:nth-child(1) {
  left: 8px;
  animation-delay: -0.24s;
}
.lds div:nth-child(2) {
  left: 32px;
  animation-delay: -0.12s;
}
.lds div:nth-child(3) {
  left: 56px;
  animation-delay: 0;
}
@keyframes lds {
  0% {
    top: 8px;
    height: 64px;
  }
  50%,
  100% {
    top: 24px;
    height: 32px;
  }
}
</style>
