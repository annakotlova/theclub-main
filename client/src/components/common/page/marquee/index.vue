<script setup lang="ts">
defineProps<{
  top?: boolean;
  word: string;
}>();
</script>

<template>
  <div class="wrap black">
    <div v-if="top" class="items-wrap">
      <div class="items marquee">
        <div class="item border">{{ word }}</div>
        <div class="item">{{ word }}</div>
        <div class="item border">{{ word }}</div>
        <div class="item">{{ word }}</div>
      </div>
      <div aria-hidden="true" class="items marquee">
        <div class="item border">{{ word }}</div>
        <div class="item">{{ word }}</div>
        <div class="item border">{{ word }}</div>
        <div class="item">{{ word }}</div>
      </div>
    </div>
    <div v-else class="items-wrap">
      <div class="items marquee reverce">
        <div class="item">{{ word }}</div>
        <div class="item border">{{ word }}</div>
        <div class="item">{{ word }}</div>
        <div class="item border">{{ word }}</div>
      </div>
      <div aria-hidden="true" class="items marquee reverce">
        <div class="item">{{ word }}</div>
        <div class="item border">{{ word }}</div>
        <div class="item">{{ word }}</div>
        <div class="item border">{{ word }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrap {
  .items-wrap {
    position: relative;
    display: flex;
    overflow: hidden;
    user-select: none;
    gap: 20px;
    &:after,
    &:before {
      content: '';
      height: 100%;
      top: 0;
      width: 10%;
      gap: 12px;
      position: absolute;
      z-index: 1;
      pointer-events: none;
    }
    .items {
      flex-shrink: 0;
      display: flex;
      gap: 20px;
      counter-reset: item;
      justify-content: space-around;
      min-width: 100%;
      .item {
        text-transform: uppercase;
        flex: 0 0 auto;
        padding: 0 32px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 110px;
        font-weight: 900;
        color: var(--grayblock_color);
        transition: all 0.1s ease-in-out;
      }
      &.marquee {
        animation: scroll 24s linear infinite;
      }
      &.reverce {
        animation-direction: reverse;
      }
    }
  }
}

@supports (-webkit-text-stroke: 2px var(--black_color)) {
  .border {
    text-shadow: none;
    color: transparent !important;
    -webkit-text-stroke: 2px var(--black_color);
  }
}

@keyframes scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(calc(-100% - 20px));
  }
}

@media (max-height: 840px), (max-width: 960px) {
  .wrap {
    .items-wrap {
      .items {
        .item {
          font-size: 60px;
          padding: 0 16px;
        }
      }
    }
  }
}
</style>
