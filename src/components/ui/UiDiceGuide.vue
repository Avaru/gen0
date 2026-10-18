<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{ sheetElement: HTMLElement }>()
const paths = ref<string[]>([])
const size = ref({ width: 0, height: 0 })
let observer: ResizeObserver | undefined

function measure() {
  const root = props.sheetElement
  const bounds = root.getBoundingClientRect()
  const approach = root.querySelector('.approaches .sheet-rating-row')?.getBoundingClientRect()
  const skill = root.querySelector('.skills .sheet-rating-row')?.getBoundingClientRect()
  const skillCard = root.querySelector('.skills')?.getBoundingClientRect()
  const approachDice = root.querySelector('.equation-approach')?.getBoundingClientRect()
  const skillDice = root.querySelector('.equation-skill')?.getBoundingClientRect()
  const skillFactor = root.querySelector('.skill-factor')?.getBoundingClientRect()
  const leftColumn = root.querySelector('.sheet-column')?.getBoundingClientRect()
  if (!approach || !skill || !skillCard || !approachDice || !skillDice || !leftColumn) return

  const ax = approach.right - bounds.left + 10
  const ay = approach.top - bounds.top + approach.height / 2
  const dx = approachDice.left - bounds.left - 10
  const dy = approachDice.top - bounds.top + approachDice.height / 2
  const gutter = (leftColumn.right + skill.left) / 2 - bounds.left
  const sx = skill.left - bounds.left + skill.width * 0.38
  const sy = skill.top - bounds.top - 4
  const bend = skillCard.top - bounds.top - 16
  const tx = skillDice.left - bounds.left + skillDice.width / 2
  const ty = (skillFactor?.bottom ?? skillDice.bottom) - bounds.top + 10

  const direction = dy >= ay ? 1 : -1
  const skillDirection = tx >= sx ? 1 : -1
  // Cut the corners at 45 degrees, matching the sheet's angular frames.
  paths.value = [
    `M ${ax} ${ay} H ${gutter - 8} L ${gutter} ${ay + direction * 8}
     V ${dy - direction * 8} L ${gutter + 8} ${dy} H ${dx}`,
    `M ${sx} ${sy} V ${bend + 8} L ${sx + skillDirection * 8} ${bend}
     H ${tx - skillDirection * 8} L ${tx} ${bend - 8} V ${ty}`,
  ]
  size.value = { width: bounds.width, height: Math.max(ay, sy, dy, ty) + 16 }
}

onMounted(() => {
  observer = new ResizeObserver(measure)
  // Observe both columns and their cards: the left card can move without changing sheet height.
  props.sheetElement
    .querySelectorAll('.sheet-column, .sheet-column > *, .dice-equation')
    .forEach((element) => observer?.observe(element))
  window.addEventListener('resize', measure)
  measure()
})
onBeforeUnmount(() => {
  observer?.disconnect()
  window.removeEventListener('resize', measure)
})
</script>

<template>
  <svg
    class="dice-guide-lines"
    :width="size.width"
    :height="size.height"
    aria-hidden="true"
    focusable="false"
  >
    <g v-for="(path, index) in paths" :key="index" :class="{ 'approach-trace': index === 0 }">
      <path :d="path" />
    </g>
  </svg>
</template>

<style scoped>
.dice-guide-lines {
  position: absolute;
  inset: 0 auto auto 0;
  z-index: 2;
  overflow: visible;
  color: var(--color-signal);
  pointer-events: none;
  animation: trace-glitch-in 220ms steps(1, end);
}
path {
  fill: none;
  stroke: currentColor;
  stroke-width: 2.5;
  stroke-linecap: square;
  stroke-linejoin: miter;
}
.approach-trace {
  color: var(--color-hot);
}
@keyframes trace-glitch-in {
  0%,
  40% {
    opacity: 0.25;
  }
  20%,
  60%,
  100% {
    opacity: 1;
  }
}
@media (prefers-reduced-motion: reduce) {
  .dice-guide-lines {
    animation: none;
  }
}
@media print {
  .dice-guide-lines {
    display: none;
  }
}
@media (forced-colors: active) {
  .dice-guide-lines {
    color: CanvasText;
  }
  .approach-trace {
    color: CanvasText;
  }
}
</style>
