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
  font: inherit;
  font-weight: 600;
}
.setting-trigger:focus-visible {
  outline-color: var(--color-on-page);
}
.setting-trigger:hover .link-label,
.setting-trigger:focus-visible .link-label {
  color: var(--color-accent);
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
  overflow-wrap: anywhere;
}
.settings button[aria-current],
.settings button:hover,
.settings button:active {
  border-color: var(--color-signal);
  background: var(--color-subtle);
}
.selected {
  color: var(--color-signal);
  font-size: 0.75rem;
}
</style>
