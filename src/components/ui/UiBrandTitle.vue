<script setup lang="ts">
import { ref } from 'vue'

const animationRun = ref(0)
</script>

<template>
  <span class="brand" @mouseenter="animationRun++">
    <span :key="`hot-${animationRun}`" class="layer layer--hot" aria-hidden="true">gen 0</span>
    <span :key="`signal-${animationRun}`" class="layer layer--signal" aria-hidden="true"
      >gen 0</span
    >
    <span class="ink">gen 0</span>
  </span>
</template>

<style scoped>
.brand {
  position: relative;
  display: inline-block;
  font-size: clamp(5rem, 16vw, 9rem);
  font-family: var(--font-display);
  font-weight: var(--theme-heading-weight);
  line-height: 0.85;
  text-transform: uppercase;
  transform: skew(var(--theme-heading-slant));
  letter-spacing: -0.06em;
  white-space: nowrap;
}
.ink {
  position: relative;
  text-shadow: 2px 0 var(--color-page);
}
.layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.layer--hot {
  color: var(--color-hot);
  transform: translateX(4px);
  animation: hot-flicker 10s steps(1, end);
}
.layer--signal {
  color: var(--color-signal);
  transform: translate(-3px, 2px);
  animation: signal-flicker 10s steps(1, end);
}
@keyframes hot-flicker {
  0% {
    transform: translateX(-180px);
    opacity: 0.55;
  }
  1% {
    transform: translateX(288px);
    opacity: 1;
  }
  2% {
    transform: translateX(-252px);
    opacity: 1;
  }
  3% {
    transform: translateX(72px);
    opacity: 0;
  }
  4% {
    transform: translateX(216px);
    opacity: 0.4;
  }
  5%,
  62%,
  69%,
  100% {
    transform: translateX(4px);
    opacity: 1;
  }
  63% {
    transform: translateX(-180px);
    opacity: 0.55;
  }
  64% {
    transform: translateX(288px);
    opacity: 1;
  }
  65% {
    transform: translateX(72px);
    opacity: 0;
  }
  66% {
    transform: translateX(-252px);
    opacity: 1;
  }
  67% {
    transform: translateX(216px);
    opacity: 0.4;
  }
  68% {
    transform: translateX(-72px);
    opacity: 1;
  }
  91% {
    transform: translateX(252px);
    opacity: 0.6;
  }
  92% {
    transform: translateX(-144px);
    opacity: 1;
  }
  93% {
    transform: translateX(4px);
    opacity: 1;
  }
}
@keyframes signal-flicker {
  0% {
    transform: translate(216px, 2px);
    opacity: 0.4;
  }
  1% {
    transform: translate(-288px, 2px);
    opacity: 1;
  }
  2% {
    transform: translate(108px, 2px);
    opacity: 0;
  }
  3% {
    transform: translate(-180px, 2px);
    opacity: 1;
  }
  4%,
  34%,
  39%,
  100% {
    transform: translate(-3px, 2px);
    opacity: 1;
  }
  35% {
    transform: translate(216px, 2px);
    opacity: 0.4;
  }
  36% {
    transform: translate(-288px, 2px);
    opacity: 1;
  }
  37% {
    transform: translate(108px, 2px);
    opacity: 0;
  }
  38% {
    transform: translate(-180px, 2px);
    opacity: 1;
  }
  78% {
    transform: translate(252px, 2px);
    opacity: 1;
  }
  79% {
    transform: translate(-216px, 2px);
    opacity: 0.5;
  }
  80% {
    transform: translate(72px, 2px);
    opacity: 1;
  }
  81% {
    transform: translate(-3px, 2px);
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .layer {
    animation: none;
  }
}
</style>
