<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    text: string
    replayKey?: unknown
    autoplay?: boolean
    fixedLayout?: boolean
  }>(),
  { autoplay: false },
)

const glyphs = Array.from('ЖДЯЮФБИЦШЩЭЫЧЛП')
const letters = computed(() => Array.from(props.text))
const replacements = ref<string[]>([])
let media: MediaQueryList | undefined
let timer: ReturnType<typeof setTimeout> | undefined

function stop() {
  clearTimeout(timer)
  timer = undefined
  replacements.value = []
}

function play() {
  stop()
  if (!media || media.matches || !props.text) return
  const start = performance.now()
  const characters = letters.value
  const candidates = characters.flatMap((letter, index) => (/\p{L}/u.test(letter) ? [index] : []))
  const selected = new Set<number>()
  const count = Math.min(2, Math.ceil(candidates.length / 8))
  for (let i = 0; i < count; i++) {
    const pick = Math.floor(Math.random() * candidates.length)
    selected.add(candidates.splice(pick, 1)[0]!)
  }
  if (!selected.size) return
  function tick() {
    const elapsed = performance.now() - start
    if (media?.matches || elapsed >= 320) {
      stop()
      return
    }
    replacements.value = characters.map((letter, index) =>
      selected.has(index) ? glyphs[Math.floor(Math.random() * glyphs.length)]! : letter,
    )
    timer = setTimeout(tick, Math.min(90, 320 - elapsed))
  }
  tick()
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
  <span class="symbol-text" :class="{ active: replacements.length, 'fixed-layout': fixedLayout }">
    <span v-if="fixedLayout" class="symbol-source"
      ><span v-for="(letter, index) in letters" :key="index" class="fixed-cell"
        ><span
          class="fixed-original"
          :class="{ concealed: replacements.length && replacements[index] !== letter }"
          >{{ letter }}</span
        ><span
          v-if="replacements.length && replacements[index] !== letter"
          class="fixed-glyph"
          aria-hidden="true"
          >{{ replacements[index] }}</span
        ></span
      ></span
    >
    <span v-else class="symbol-source">{{ text }}</span>
    <span v-if="!fixedLayout && replacements.length" class="symbol-overlay" aria-hidden="true">
      <span
        v-for="(letter, index) in letters"
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
.fixed-layout.active > .symbol-source {
  opacity: 1;
}
.fixed-cell {
  position: relative;
  display: inline-block;
  white-space: pre;
  text-box-trim: trim-both;
  text-box-edge: cap alphabetic;
}
.fixed-original.concealed {
  visibility: hidden;
}
.fixed-glyph {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: scaleX(0.5);
  pointer-events: none;
  font-family: system-ui, sans-serif;
  font-weight: 900;
  font-size: 0.85em;
  line-height: 1;
  color: var(--color-neon);
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
