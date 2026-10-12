<script setup lang="ts">
withDefaults(
  defineProps<{
    kind: 'stress' | 'dice'
    label?: string
    monochrome?: boolean
    framed?: boolean
  }>(),
  { monochrome: false, framed: true },
)
</script>

<template>
  <svg
    class="sheet-symbol"
    :class="{ monochrome }"
    viewBox="0 0 24 24"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : true"
    focusable="false"
  >
    <path v-if="kind === 'stress'" class="lightning" d="M14 1 4 14h7l-1 9L20 10h-7z" />
    <template v-else>
      <rect v-if="framed" class="square" x="2" y="2" width="20" height="20" />
      <path class="plus" d="M12 7v10M7 12h10" />
    </template>
  </svg>
</template>

<style scoped>
.sheet-symbol {
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: -0.125em;
  flex-shrink: 0;
}
.lightning {
  fill: var(--sheet-symbol-ink, #fff);
}
.square {
  fill: none;
  stroke: var(--sheet-symbol-square, var(--color-signal, #52f4ed));
  stroke-width: 2;
}
.plus {
  fill: none;
  stroke: var(--sheet-symbol-ink, #fff);
  stroke-width: 2.5;
}
.monochrome {
  --sheet-symbol-ink: #000;
  --sheet-symbol-square: #000;
}
@media print {
  .sheet-symbol {
    --sheet-symbol-ink: currentColor;
    --sheet-symbol-square: currentColor;
  }
}
@media (forced-colors: active) {
  .sheet-symbol {
    --sheet-symbol-ink: CanvasText;
    --sheet-symbol-square: CanvasText;
  }
}
</style>
