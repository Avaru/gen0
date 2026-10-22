<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    text: string
    replayKey?: unknown
    autoplay?: boolean
  }>(),
  { autoplay: false },
)

const glyphs = Array.from('ЖДЯЮФБИЦШЩЭЫЧЛП')
const replacements = ref<string[]>([])
let media: MediaQueryList | undefined
let frame: number | undefined

function stop() {
  if (frame !== undefined) cancelAnimationFrame(frame)
  frame = undefined
  replacements.value = []
}

function play() {
  stop()
  if (!media || media.matches || !props.text) return
  const start = performance.now()
  let lastUpdate = -Infinity
  const letters = Array.from(props.text)
  const candidates = letters.flatMap((letter, index) => (/\p{L}/u.test(letter) ? [index] : []))
  const selected = new Set<number>()
  const count = Math.min(2, Math.ceil(candidates.length / 8))
  for (let i = 0; i < count; i++) {
    const pick = Math.floor(Math.random() * candidates.length)
    selected.add(candidates.splice(pick, 1)[0]!)
  }
  function tick(now: number) {
    if (media?.matches || now - start >= 320) {
      stop()
      return
    }
    if (now - lastUpdate >= 90) {
      replacements.value = letters.map((letter, index) =>
        selected.has(index) ? glyphs[Math.floor(Math.random() * glyphs.length)]! : letter,
      )
      lastUpdate = now
    }
    frame = requestAnimationFrame(tick)
  }
  tick(start)
}

function motionChanged() {
  if (media?.matches) stop()
}
onMounted(() => {
  media = window.matchMedia('(prefers-reduced-motion: reduce)')
  media.addEventListener('change', motionChanged)
  if (props.autoplay) play()
})
watch(() => props.replayKey, play)
watch(() => props.text, stop)
onBeforeUnmount(() => {
  stop()
  media?.removeEventListener('change', motionChanged)
})
</script>

<template>
  <span class="symbol-text" :class="{ active: replacements.length }">
    <span class="symbol-source">{{ text }}</span>
    <span v-if="replacements.length" class="symbol-overlay" aria-hidden="true">
      <span
        v-for="(letter, index) in Array.from(text)"
        :key="index"
        class="cell"
        :class="{ replaced: replacements[index] !== letter }"
      >
        <span class="measure">{{ letter }}</span
        ><span class="glyph">{{ replacements[index] }}</span>
      </span>
    </span>
  </span>
</template>

<style scoped>
.symbol-text {
  position: relative;
  display: inline-block;
  max-width: 100%;
}
.symbol-text.active > .symbol-source {
  opacity: 0;
}
.symbol-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  pointer-events: none;
  user-select: none;
}
.cell {
  position: relative;
  display: inline-block;
  min-width: 0;
  flex: 0 1 auto;
  white-space: pre;
}
.measure {
  visibility: hidden;
}
.glyph {
  position: absolute;
  inset: 0;
  text-align: center;
  color: inherit;
}
.replaced .glyph {
  font-family: system-ui, sans-serif;
  font-weight: 900;
  color: var(--color-neon);
}
@media (prefers-reduced-motion: reduce) {
  .symbol-text.active > .symbol-source {
    opacity: 1;
  }
  .symbol-overlay {
    display: none;
  }
}
@media (forced-colors: active) {
  .glyph {
    color: CanvasText;
    text-shadow: none;
  }
}
</style>
