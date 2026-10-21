<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import UiButton from './UiButton.vue'
import UiModal from './UiModal.vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    options: readonly { id: string; label: string; group: string; description?: string }[]
    label?: string
    description?: string
    plural?: string
    triggerLabel?: string
    searchable?: boolean
    showSelection?: boolean
    triggerId?: string
  }>(),
  {
    label: 'Category',
    plural: 'categories',
    triggerId: 'category',
    searchable: true,
    showSelection: true,
  },
)
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const id = useId()
const dialog = ref<InstanceType<typeof UiModal>>()
const trigger = ref<HTMLButtonElement>()
const actionTrigger = ref<InstanceType<typeof UiButton>>()
const search = ref<HTMLInputElement>()
const query = ref('')
const opened = ref(false)
let chosen: string | undefined
const selected = computed(() => props.options.find((option) => option.id === props.modelValue))
const filtered = computed(() => {
  const terms = query.value.trim().toLocaleLowerCase().split(/\s+/)
  return props.options.filter((option) =>
    terms.every((term) => `${option.label} ${option.group}`.toLocaleLowerCase().includes(term)),
  )
})
const groups = computed(() => [...new Set(filtered.value.map((option) => option.group))])

async function open() {
  query.value = ''
  await dialog.value?.showModal()
  opened.value = true
  if (props.searchable && window.matchMedia('(min-width: 40rem) and (pointer: fine)').matches) {
    search.value?.focus({ preventScroll: true })
  }
}
function close() {
  dialog.value?.close()
}
function closed() {
  opened.value = false
  const button = trigger.value ?? (actionTrigger.value?.$el as HTMLButtonElement | undefined)
  button?.focus({ preventScroll: true })
  if (chosen !== undefined) {
    emit('update:modelValue', chosen)
    chosen = undefined
  }
}
function choose(value: string) {
  chosen = value
  close()
}
function enter() {
  if (filtered.value.length === 1) choose(filtered.value[0]!.id)
}
</script>

<template>
  <div class="picker">
    <span v-if="!triggerLabel" :id="`${id}-label`" class="label">{{ label }}</span>
    <UiButton
      v-if="triggerLabel"
      :id="triggerId"
      ref="actionTrigger"
      aria-haspopup="dialog"
      :aria-expanded="opened"
      :aria-controls="`${id}-dialog`"
      @click="open"
      >{{ triggerLabel }}</UiButton
    >
    <button
      v-else
      :id="triggerId"
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
      <span :id="`${id}-value`">{{ selected?.label ?? `Choose ${label.toLowerCase()}` }}</span>
      <svg
        class="arrow"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M7 17 17 7M7 7h10v10" />
      </svg>
    </button>
    <UiModal
      :id="`${id}-dialog`"
      ref="dialog"
      :title="`Choose ${label.toLowerCase()}`"
      :close-label="`Close ${label.toLowerCase()} picker`"
      @close="closed"
    >
      <template #actions><slot name="actions" /></template>
      <div v-if="searchable" class="search">
        <label :for="`${id}-search`">Search {{ plural }}</label>
        <input
          :id="`${id}-search`"
          ref="search"
          v-model="query"
          type="search"
          placeholder="Type a name or group…"
          autocomplete="off"
          :aria-controls="`${id}-choices`"
          @keydown.enter.prevent="enter"
        />
        <p class="match-status" role="status" aria-atomic="true">
          {{
            filtered.length
              ? `${filtered.length} ${plural}`
              : `No ${plural} found. Try another search.`
          }}
        </p>
      </div>
      <div :id="`${id}-choices`" class="groups">
        <p v-if="description" class="rule">{{ description }}</p>
        <section
          v-for="(group, index) in groups"
          :key="group"
          :aria-labelledby="group ? `${id}-group-${index}` : undefined"
        >
          <h3 v-if="group" :id="`${id}-group-${index}`">{{ group }}</h3>
          <div class="choices">
            <button
              v-for="option in filtered.filter((item) => item.group === group)"
              :key="option.id"
              type="button"
              :data-category="label === 'Category' ? option.id : undefined"
              :data-choice="option.id"
              :aria-current="showSelection && option.id === modelValue ? 'true' : undefined"
              @click="choose(option.id)"
            >
              <span class="choice-text" :class="{ 'with-rule': option.description }">
                <span class="choice-name">{{ option.label }}</span>
                <span v-if="option.description" class="choice-rule">
                  <span
                    v-for="(line, index) in option.description.split('\n')"
                    :key="index"
                    class="rule-line"
                  >
                    <span v-if="index" class="rule-separator" aria-hidden="true"> | </span>
                    <template v-for="(part, partIndex) in line.split(/(\d+)/)" :key="partIndex"
                      ><span v-if="/^\d+$/.test(part)" class="rule-number">{{ part }}</span
                      ><template v-else>{{ part }}</template></template
                    >
                  </span>
                </span>
              </span>
              <span v-if="showSelection && option.id === modelValue" class="current"
                >Selected <span aria-hidden="true">✓</span></span
              >
            </button>
          </div>
        </section>
        <slot />
      </div>
    </UiModal>
  </div>
</template>

<style scoped>
.picker {
  display: grid;
  gap: var(--space-2);
  min-width: 0;
}
.rule {
  margin-bottom: var(--space-4);
  font-size: var(--font-sheet-rule-size);
  line-height: 1.35;
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
button:not(.primary),
input {
  transition: var(--control-color-transition);
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
.arrow {
  flex-shrink: 0;
  color: var(--color-signal);
}
button:not(.primary):hover {
  border-color: var(--color-signal);
  background: var(--color-subtle);
}
button:not(.primary):active {
  background: color-mix(in srgb, var(--color-signal) 16%, var(--color-surface));
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
.choice-rule {
  display: block;
  font-size: var(--font-sheet-rule-size);
  font-weight: normal;
  line-height: 1.35;
  font-family: var(--font-body);
  letter-spacing: normal;
  text-transform: none;
}
.with-rule {
  display: flow-root;
}
.choices button:has(.with-rule) {
  align-items: flex-start;
}
.with-rule .choice-name {
  float: left;
  margin-inline-end: var(--space-2);
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.rule-separator {
  margin-inline: var(--space-1);
  color: var(--color-accent);
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1;
}
.rule-number {
  font-family: var(--font-display);
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1;
  color: var(--color-signal);
}
.choices button:hover .rule-number {
  color: inherit;
}
@media (min-width: 40rem) {
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

@media screen {
  .choices button {
    position: relative;
    overflow: hidden;
  }
  .choice-text {
    pointer-events: none;
  }
  .choices button:not(.primary):hover {
    background: var(--color-primary-hover, #fff);
    color: var(--color-on-accent);
  }
  .choices button:hover .current {
    color: inherit;
  }
}
@media screen and (prefers-reduced-motion: no-preference) {
  .choice-text {
    position: relative;
    z-index: 1;
  }
  .choices button::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0;
    background:
      repeating-linear-gradient(0deg, currentColor 0 1px, transparent 1px 4px),
      repeating-linear-gradient(
        113deg,
        transparent 0 7px,
        currentColor 7px 8px,
        transparent 8px 13px
      );
    background-size:
      100% 9px,
      19px 15px;
  }
  @media (hover: hover) {
    .choices button:hover .choice-text {
      animation: choice-text-glitch 200ms steps(1, end);
    }
    .choices button:hover::before {
      animation: choice-noise-glitch 200ms steps(1, end);
    }
  }
}
@keyframes choice-text-glitch {
  0% {
    transform: translateX(-3%) scale(1.12, 0.9) skewX(-6deg);
  }
  25% {
    transform: translate(8%, -1px) scale(1.3, 1.05) skewX(8deg);
  }
  50% {
    transform: translate(-6%, 1px) scale(0.95, 1.15);
  }
  75% {
    transform: translateX(2%) scale(1.12, 0.95);
  }
  100% {
    transform: none;
  }
}
@keyframes choice-noise-glitch {
  0%,
  50% {
    opacity: 0.18;
    background-position:
      4px -2px,
      -7px 3px;
  }
  25%,
  75% {
    opacity: 0.04;
    background-position:
      -3px 2px,
      5px -4px;
  }
  100% {
    opacity: 0;
  }
}
</style>
