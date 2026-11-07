<script setup lang="ts">
import { ref, useId } from 'vue'
import { settings } from '@/generator/settingRegistry'
import UiModal from './UiModal.vue'

defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
const id = useId()
const dialog = ref<InstanceType<typeof UiModal>>()
const trigger = ref<HTMLButtonElement>()
const opened = ref(false)
let selected: string | undefined
function open() {
  dialog.value?.showModal()
  opened.value = true
}
function choose(value: string) {
  selected = value
  dialog.value?.close()
}
function closed() {
  opened.value = false
  trigger.value?.focus({ preventScroll: true })
  if (selected !== undefined) {
    emit('update:modelValue', selected)
    selected = undefined
  }
}
</script>
<template>
  <button
    ref="trigger"
    class="setting-trigger"
    type="button"
    aria-haspopup="dialog"
    :aria-expanded="opened"
    :aria-controls="`${id}-settings`"
    @click="open"
  >
    <span class="link-label">Setting</span>
  </button>
  <UiModal
    :id="`${id}-settings`"
    ref="dialog"
    title="Choose setting"
    close-label="Close setting picker"
    fit-content
    @close="closed"
  >
    <div class="settings">
      <button
        v-for="setting in settings"
        :key="setting.id"
        type="button"
        :data-setting="setting.id"
        :aria-current="setting.id === modelValue ? 'true' : undefined"
        @click="choose(setting.id)"
      >
        <span>{{ setting.label }}</span>
        <span v-if="setting.id === modelValue" class="selected">Selected ✓</span>
      </button>
    </div>
  </UiModal>
</template>
<style scoped>
.setting-trigger {
  padding: 0 1px;
  border: 0;
  background: none;
  color: inherit;
  font-family: var(--font-choice, inherit);
  font-size: var(--font-choice-size, inherit);
  font-weight: var(--font-choice-weight, 600);
  line-height: var(--line-height-choice, normal);
}
.setting-trigger:focus-visible {
  outline-color: var(--color-on-page);
}
.setting-trigger:hover .link-label,
.setting-trigger:focus-visible .link-label {
  color: var(--color-link-hover, var(--color-accent));
  background-size: 100% 100%;
}
.settings {
  display: grid;
  gap: var(--space-2);
  overflow-y: auto;
  padding: var(--space-4);
}
.settings button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-control-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  text-align: left;
  font-family: var(--font-choice, var(--font-display));
  font-size: var(--font-choice-size, inherit);
  font-weight: var(--font-choice-weight, 700);
  line-height: var(--line-height-choice, normal);
  overflow-wrap: anywhere;
}
.settings button[aria-current],
.settings button:is(:hover, :focus-visible) {
  border-color: var(--color-signal);
  background: var(--color-subtle);
}
.settings button:is(:hover, :focus-visible) {
  background: var(--control-hover-fill, var(--color-subtle));
  color: var(--control-hover-ink, var(--color-text));
}
.settings button:active {
  background: var(--control-active-texture, none) var(--control-active-fill, var(--color-subtle));
  color: var(--control-active-ink, var(--color-text));
}
.settings button:is(:hover, :focus-visible, :active) .selected {
  color: inherit;
}
.selected {
  color: var(--color-signal);
  font-size: 0.75rem;
}
.settings button:where([data-theme='never-midnight'] *) {
  font-family: var(--font-brutal);
  font-weight: 400;
  font-size: 0.8125rem;
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-control-border);
}
.settings button:where([data-theme='never-midnight'] *):is([aria-current], :hover, :active) {
  background: var(--color-subtle);
}
.selected:where([data-theme='never-midnight'] *) {
  color: inherit;
}
</style>
