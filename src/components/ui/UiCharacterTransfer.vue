<script setup lang="ts">
import { nextTick, ref, useId } from 'vue'
import { useCharacterStore } from '@/stores/character'
import UiButton from './UiButton.vue'
import UiModal from './UiModal.vue'
import UiSheetField from './UiSheetField.vue'

const character = useCharacterStore()
const id = useId()
const dialog = ref<InstanceType<typeof UiModal>>()
const trigger = ref<InstanceType<typeof UiButton>>()
const textarea = ref<InstanceType<typeof UiSheetField>>()
const json = ref('')
const error = ref('')
const status = ref('')
const opened = ref(false)

function open() {
  json.value = JSON.stringify(character.sheet)
  error.value = ''
  status.value = ''
  dialog.value?.showModal()
  opened.value = true
}
function closed() {
  opened.value = false
  ;(trigger.value?.$el as HTMLButtonElement | undefined)?.focus({ preventScroll: true })
}
function importCharacter() {
  error.value = ''
  status.value = ''
  try {
    character.importCharacter(json.value)
    dialog.value?.close()
  } catch {
    error.value = 'Import failed. Paste valid character JSON and try again.'
  }
}
async function exportCharacter() {
  json.value = JSON.stringify(character.sheet)
  error.value = ''
  status.value = ''
  try {
    await navigator.clipboard.writeText(json.value)
    status.value = 'Copied to clipboard.'
  } catch {
    await nextTick()
    textarea.value?.select()
    status.value = 'Copy the selected JSON to export your character.'
  }
}
</script>

<template>
  <UiButton
    ref="trigger"
    aria-haspopup="dialog"
    :aria-expanded="opened"
    :aria-controls="`${id}-dialog`"
    @click="open"
    >import/export</UiButton
  >
  <UiModal
    :id="`${id}-dialog`"
    ref="dialog"
    title="Import/export"
    close-label="Close import/export"
    fit-content
    @close="closed"
  >
    <div class="transfer">
      <p class="rule">
        Copy this spaghetti somewhere to save it, or import existing spaghetti to import it here
      </p>
      <div class="transfer-field">
        <UiSheetField
          :id="`${id}-json`"
          ref="textarea"
          v-model="json"
          variant="runner"
          label="Character JSON"
          multiline
          :spellcheck="false"
        />
      </div>
      <p v-if="error" role="alert">{{ error }}</p>
      <div class="actions">
        <UiButton @click="importCharacter">Import</UiButton>
        <div class="copy-action">
          <UiButton @click="exportCharacter">Copy to clipboard</UiButton>
          <p v-if="status" role="status">{{ status }}</p>
        </div>
      </div>
    </div>
  </UiModal>
</template>

<style scoped>
.rule {
  font-size: var(--font-sheet-rule-size);
  line-height: 1.35;
}
.transfer {
  display: grid;
  gap: var(--space-3);
  padding: var(--space-4);
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
}
@media (min-width: 40rem) {
  .transfer {
    padding: var(--space-6);
  }
}
.transfer-field {
  display: grid;
  gap: var(--space-1);
  min-width: 0;
}
.copy-action {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}
[role='alert'] {
  color: var(--color-hot);
}
</style>
