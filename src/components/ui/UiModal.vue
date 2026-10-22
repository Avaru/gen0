<script setup lang="ts">
import { nextTick, ref } from 'vue'

const props = defineProps<{ id: string; title: string; closeLabel: string; fitContent?: boolean }>()
defineEmits<{ close: [] }>()
const dialog = ref<HTMLDialogElement>()
const closeButton = ref<HTMLButtonElement>()
const initialized = ref(false)
async function showModal() {
  initialized.value = true
  await nextTick()
  dialog.value?.showModal()
  closeButton.value?.focus({ preventScroll: true })
}
function close() {
  dialog.value?.close()
}
function wrapFocus(event: KeyboardEvent) {
  const controls = dialog.value?.querySelectorAll<HTMLElement>(
    'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href]',
  )
  if (!controls?.length) return
  const first = controls[0]!
  const last = controls[controls.length - 1]!
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}
defineExpose({ showModal, close })
</script>

<template>
  <dialog
    :id="props.id"
    ref="dialog"
    :class="{ 'fit-content': fitContent }"
    :aria-labelledby="`${props.id}-heading`"
    @close="$emit('close')"
    @keydown.tab="wrapFocus"
  >
    <div v-if="initialized" class="panel">
      <header>
        <h2 :id="`${props.id}-heading`">{{ title }}</h2>
        <div class="header-actions">
          <slot name="actions" />
          <button
            ref="closeButton"
            class="close"
            type="button"
            :aria-label="closeLabel"
            @click="close"
          >
            ✕
          </button>
        </div>
      </header>
      <slot />
    </div>
  </dialog>
</template>

<style scoped>
dialog {
  position: fixed;
  inset: 0;
  width: 100%;
  max-width: none;
  height: 100%;
  height: 100dvh;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  border-top: 5px solid var(--color-signal);
  background: var(--color-surface);
  background-image: var(--theme-panel-texture);
  color: var(--color-text);
}
dialog::backdrop {
  background: rgb(0 0 0 / 75%);
}
.panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-4);
}
h2 {
  min-width: 0;
  overflow-wrap: anywhere;
  font-family: var(--font-display);
  font-size: var(--font-modal-heading-size, clamp(2rem, 6vw, 3rem));
  text-transform: uppercase;
  color: var(--color-signal);
  line-height: 1;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
}
.close {
  flex-shrink: 0;
  width: var(--control-height);
  font-size: 1.25rem;
  transition: var(--control-color-transition);
  border: 1px solid var(--color-control-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  padding: var(--space-2) var(--space-3);
  min-height: var(--control-height);
}
.close:hover {
  border-color: var(--color-signal);
  background: var(--color-subtle);
}
.close:active {
  background: color-mix(in srgb, var(--color-signal) 16%, var(--color-surface));
}
@media (min-width: 40rem) {
  dialog {
    width: min(44rem, calc(100% - 4rem));
    height: min(48rem, calc(100dvh - 4rem));
    margin: auto;
    border: 1px solid var(--color-control-border);
    border-top: 5px solid var(--color-signal);
  }
  header {
    padding: var(--space-6);
  }
}
dialog.fit-content {
  bottom: auto;
  height: auto;
  max-height: calc(100dvh - var(--space-4) * 2);
  max-width: calc(100% - var(--space-4) * 2);
  margin: var(--space-4) auto 0;
  overflow-y: auto;
}
.fit-content .panel {
  height: auto;
}
dialog:where([data-theme='never-midnight'] *) {
  --color-surface: #211a29;
  --color-subtle: #382a43;
  --color-text: #eee0f0;
  --color-muted: #c6b1cd;
  --color-signal: #eee0f0;
  --color-border: #9573aa;
  --color-control-border: #9573aa;
  --color-focus: var(--color-neon);
  width: min(44rem, calc(100% - 1.5rem));
  height: min(48rem, calc(100dvh - 1.5rem));
  margin: auto;
  border: 2px dashed var(--color-ritual);
  border-top: 7px double var(--color-neon);
  border-right: 5px dashed var(--color-neon);
  box-shadow:
    7px 7px 0 #080808,
    10px 10px 0 #8052ac80;
  background: var(--color-surface);
  rotate: -0.6deg;
  overflow: hidden;
}
dialog:where([data-theme='never-midnight'] *)::backdrop {
  background-color: #100a17dc;
  background-image: var(--theme-page-texture);
  background-size: var(--theme-page-texture-size);
  backdrop-filter: blur(7px) saturate(0.4);
}
.panel:where([data-theme='never-midnight'] *) {
  position: relative;
  isolation: isolate;
}
.panel:where([data-theme='never-midnight'] *)::before,
.panel:where([data-theme='never-midnight'] *)::after {
  content: '';
  position: absolute;
  z-index: -1;
  width: min(75vw, 28rem);
  aspect-ratio: 1;
  background: var(--color-neon);
  mask: var(--theme-arcane-seal) center / contain no-repeat;
  pointer-events: none;
  opacity: 0.2;
}
.panel:where([data-theme='never-midnight'] *)::before {
  top: 3rem;
  right: -5rem;
  rotate: 23deg;
}
.panel:where([data-theme='never-midnight'] *)::after {
  bottom: -5rem;
  left: -4rem;
  width: min(60vw, 20rem);
  background: var(--color-ritual);
  rotate: -31deg;
  opacity: 0.5;
}
header:where([data-theme='never-midnight'] *) {
  position: relative;
  border-bottom: 2px dashed var(--color-neon);
  margin: 0 var(--space-4) var(--space-4);
  padding-inline: 0;
}
h2:where([data-theme='never-midnight'] *) {
  font-family: var(--font-brutal);
  font-size: clamp(1.25rem, 4vw, 2rem);
  font-weight: 400;
  color: var(--color-page);
  background: var(--color-on-page);
  padding: 0.08em 0.12em;
  text-box-trim: trim-both;
  text-box-edge: cap alphabetic;
  text-transform: uppercase;
  letter-spacing: -0.04em;
  line-height: 1.2;
  rotate: -2deg;
}
.close:where([data-theme='never-midnight'] *) {
  border: 2px dashed var(--color-neon);
  rotate: 5deg;
  color: var(--color-neon);
  background: transparent;
}
@media (max-width: 39.999rem) {
  dialog:where([data-theme='never-midnight'] *) {
    rotate: 0deg;
  }
}
@media (forced-colors: active) {
  .panel:where([data-theme='never-midnight'] *)::before,
  .panel:where([data-theme='never-midnight'] *)::after {
    display: none;
  }
  dialog:where([data-theme='never-midnight'] *) {
    border-color: CanvasText;
  }
}
@media print {
  dialog {
    display: none !important;
  }
}
</style>
