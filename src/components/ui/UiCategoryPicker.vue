<script setup lang="ts">
import { computed, nextTick, ref, useId } from 'vue'

const props = defineProps<{
  modelValue: string
  options: readonly { id: string; label: string; group: string }[]
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const id = useId()
const dialog = ref<HTMLDialogElement>()
const trigger = ref<HTMLButtonElement>()
const search = ref<HTMLInputElement>()
const query = ref('')
const opened = ref(false)
const selected = computed(() => props.options.find(option => option.id === props.modelValue))
const filtered = computed(() => {
  const terms = query.value.trim().toLocaleLowerCase().split(/\s+/)
  return props.options.filter(option =>
    terms.every(term => `${option.label} ${option.group}`.toLocaleLowerCase().includes(term)),
  )
})
const groups = computed(() => [...new Set(filtered.value.map(option => option.group))])

async function open() {
  query.value = ''
  await nextTick()
  dialog.value?.showModal()
  opened.value = true
  search.value?.focus()
}
function close() {
  dialog.value?.close()
}
function closed() {
  opened.value = false
  trigger.value?.focus()
}
function choose(value: string) {
  emit('update:modelValue', value)
  close()
}
function wrapFocus(event: KeyboardEvent) {
  const controls = dialog.value?.querySelectorAll<HTMLElement>('button, input')
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
function enter() {
  if (filtered.value.length === 1) choose(filtered.value[0]!.id)
}
</script>

<template>
  <div class="picker">
    <span :id="`${id}-label`" class="label">Category</span>
    <button
      id="category"
      ref="trigger"
      class="trigger"
      type="button"
      aria-haspopup="dialog"
      :aria-expanded="opened"
      :aria-controls="`${id}-dialog`"
      :aria-labelledby="`${id}-label ${id}-value`"
      :data-value="modelValue"
      @click="open"
    >
      <span :id="`${id}-value`">{{ selected?.label ?? 'Choose category' }}</span>
      <span aria-hidden="true">↗</span>
    </button>
    <dialog
      :id="`${id}-dialog`"
      ref="dialog"
      :aria-labelledby="`${id}-heading`"
      @close="closed"
      @keydown.tab="wrapFocus"
    >
      <div class="panel">
        <header>
          <h2 :id="`${id}-heading`">Choose category</h2>
          <button class="close" type="button" aria-label="Close category picker" @click="close">✕</button>
        </header>
        <div class="search">
          <label :for="`${id}-search`">Search categories</label>
          <input
            :id="`${id}-search`"
            ref="search"
            v-model="query"
            type="search"
            placeholder="Type a name or group…"
            autocomplete="off"
            autofocus
            :aria-controls="`${id}-choices`"
            @keydown.enter.prevent="enter"
          />
          <p class="match-status" role="status" aria-atomic="true">
            {{ filtered.length ? `${filtered.length} categories` : 'No categories found. Try another search.' }}
          </p>
        </div>
        <div :id="`${id}-choices`" class="groups">
          <section v-for="(group, index) in groups" :key="group" :aria-labelledby="`${id}-group-${index}`">
            <h3 :id="`${id}-group-${index}`">{{ group }}</h3>
            <div class="choices">
              <button
                v-for="option in filtered.filter(item => item.group === group)"
                :key="option.id"
                type="button"
                :data-category="option.id"
                :aria-current="option.id === modelValue ? 'true' : undefined"
                @click="choose(option.id)"
              >
                <span>{{ option.label }}</span>
                <span v-if="option.id === modelValue" class="current">Selected <span aria-hidden="true">✓</span></span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
.picker {
  display: grid;
  gap: var(--space-2);
  min-width: 0;
}
.label,
.search label {
  color: var(--color-muted);
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}
.label::before {
  content: '';
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: var(--space-2);
  background: var(--theme-label-mark);
}
button,
input {
  border: 1px solid var(--color-control-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  padding: var(--space-2) var(--space-3);
}
.trigger {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  text-align: left;
  overflow-wrap: anywhere;
}
.trigger > :last-child {
  color: var(--color-signal);
  font-size: 1.25rem;
}
button:hover {
  border-color: var(--color-signal);
  background: var(--color-subtle);
}
[data-theme='cyberpunk2077'] .trigger {
  position: relative;
  isolation: isolate;
  border: 0;
  background: transparent;
  color: var(--color-hot);
  text-transform: uppercase;
  letter-spacing: 0.035em;
}
[data-theme='cyberpunk2077'] .trigger::before,
[data-theme='cyberpunk2077'] .trigger::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  clip-path: var(--theme-action-shape);
}
[data-theme='cyberpunk2077'] .trigger::before {
  z-index: -2;
  background: var(--color-control-border);
}
[data-theme='cyberpunk2077'] .trigger::after {
  z-index: -1;
  inset: 1px 1px 1px 4px;
  background: var(--color-surface);
}
[data-theme='cyberpunk2077'] .trigger:hover::before {
  background: var(--color-signal);
}
@media (forced-colors: active) {
  [data-theme='cyberpunk2077'] .trigger {
    border: 1px solid ButtonText;
  }
}
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
  font-family: var(--font-display);
  font-size: clamp(2rem, 6vw, 3rem);
  text-transform: uppercase;
  color: var(--color-signal);
  line-height: 1;
}
.close {
  flex-shrink: 0;
  width: var(--control-height);
  font-size: 1.25rem;
}
.search {
  display: grid;
  gap: var(--space-2);
  padding: 0 var(--space-4) var(--space-4);
  border-bottom: 1px solid var(--color-border);
}
input {
  width: 100%;
  min-width: 0;
}
.match-status {
  font-size: 0.8125rem;
  color: var(--color-muted);
}
.groups {
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: var(--space-4);
  scrollbar-gutter: stable;
}
section + section {
  margin-top: var(--space-6);
}
h3 {
  margin: 0 0 var(--space-2);
  color: var(--color-accent);
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.choices {
  display: grid;
  gap: var(--space-2);
}
.choices button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  text-align: left;
  overflow-wrap: anywhere;
}
.choices button[aria-current] {
  border-color: var(--color-signal);
  background: var(--color-subtle);
}
.current {
  color: var(--color-signal);
  font-size: 0.75rem;
  flex-shrink: 0;
}
@media (min-width: 40rem) {
  dialog {
    width: min(44rem, calc(100% - 4rem));
    height: min(48rem, calc(100dvh - 4rem));
    margin: auto;
    border: 1px solid var(--color-control-border);
    border-top: 5px solid var(--color-signal);
  }
  header,
  .groups {
    padding: var(--space-6);
  }
  .search {
    padding-inline: var(--space-6);
  }
  .choices {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
