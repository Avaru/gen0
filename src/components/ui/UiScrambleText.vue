<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    text: string
    replayKey?: unknown
    duration?: number
    delay?: number
  }>(),
  { duration: 550, delay: 0 },
)

const resolvedText = ref('')
const garbledText = ref('')
const animating = ref(false)
const symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&?'
let media: MediaQueryList | undefined
let frame: number | undefined

function stop() {
  if (frame !== undefined) cancelAnimationFrame(frame)
  frame = undefined
  animating.value = false
  resolvedText.value = ''
  garbledText.value = ''
}

function reveal() {
  stop()
  // Only start after checking the user's current motion preference.
  if (!media || media.matches || !props.text || props.duration <= 0) return
  const letters = Array.from(props.text)
  const now = performance.now()
  const start = now + Math.max(0, props.delay)
  let lastUpdate = -Infinity
  animating.value = true

  function tick(now: number) {
    if (media?.matches) {
      stop()
      return
    }
    const progress = Math.max(0, Math.min((now - start) / props.duration, 1))
    if (progress >= 1) {
      stop()
      return
    }
    if (lastUpdate === -Infinity || (now >= start && now - lastUpdate >= 45)) {
      const resolved = Math.floor(progress * letters.length)
      resolvedText.value = letters.slice(0, resolved).join('')
      garbledText.value = letters
        .slice(resolved)
        .map((letter) =>
          /\s/u.test(letter) ? letter : symbols[Math.floor(Math.random() * symbols.length)],
        )
        .join('')
      lastUpdate = now
    }
    frame = requestAnimationFrame(tick)
  }

  tick(now)
}

function motionChanged() {
  if (media?.matches) stop()
}

onMounted(() => {
  media = window.matchMedia('(prefers-reduced-motion: reduce)')
  media.addEventListener('change', motionChanged)
  reveal()
})
watch(() => [props.text, props.replayKey], reveal)
onBeforeUnmount(() => {
  stop()
  media?.removeEventListener('change', motionChanged)
})
</script>

<template>
  <span class="scramble" :class="{ animating }">
    <span class="source">{{ text }}</span>
    <span
      v-if="animating"
      class="overlay"
      aria-hidden="true"
      :data-resolved="resolvedText"
      :data-garbled="garbledText"
    />
  </span>
</template>

<style scoped>
.scramble {
  position: relative;
  display: inline-block;
  max-width: 100%;
}
.animating .source {
  opacity: 0;
}
.overlay {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
}
.overlay::before {
  content: attr(data-resolved);
}
.overlay::after {
  content: attr(data-garbled);
  color: var(--scramble-color, var(--color-signal));
}
@media (prefers-reduced-motion: reduce) {
  .animating .source {
    opacity: 1;
  }
  .overlay {
    display: none;
  }
}
</style>
