<script setup lang="ts">
import { nextTick, ref } from 'vue'
import type { StudentEntry } from '@/data/characters/never-midnight'
import UiButton from '@/components/ui/UiButton.vue'
import UiSheetCard from '@/components/ui/UiSheetCard.vue'
import UiSheetField from '@/components/ui/UiSheetField.vue'
import UiShadeRating from '@/components/ui/UiShadeRating.vue'
const props = defineProps<{
  title: string
  singular: string
  id: string
  locked?: boolean
  rerollable?: boolean
}>()
const emit = defineEmits<{ reroll: [index: number] }>()
const entries = defineModel<StudentEntry[]>({ required: true })
const list = ref<HTMLElement>()
const addButton = ref<InstanceType<typeof UiButton>>()
async function add() {
  entries.value.push(props.id === 'spells' ? { description: '' } : { description: '', value: 1 })
  await nextTick()
  list.value
    ?.querySelectorAll('textarea')
    .item(entries.value.length - 1)
    ?.focus()
}
async function remove(index: number) {
  entries.value.splice(index, 1)
  await nextTick()
  const fields = list.value?.querySelectorAll('textarea')
  const field = fields?.item(Math.min(index, entries.value.length - 1))
  if (field) field.focus()
  else (addButton.value?.$el as HTMLButtonElement | undefined)?.focus()
}
</script>

<template>
  <UiSheetCard :title="title" :heading-id="`${id}-heading`">
    <template v-if="!locked" #actions
      ><UiButton ref="addButton" variant="secondary" @click="add"
        >Add {{ singular.toLowerCase() }}</UiButton
      ></template
    >
    <div ref="list" class="entries">
      <div
        v-for="(entry, index) in entries"
        :key="index"
        class="entry"
        :class="{ unrated: id === 'spells', locked }"
      >
        <div class="description-field" :class="{ rerollable: rerollable && !locked }">
          <UiSheetField
            :id="`${id}-${index}`"
            v-model="entry.description"
            :disabled="locked"
            :aria-label="`${singular} ${index + 1}`"
            multiline
            :rows="1"
            auto-grow
          />
          <UiButton
            v-if="rerollable && !locked"
            class="reroll"
            variant="secondary"
            :aria-label="`Reroll ${singular.toLowerCase()} ${index + 1}`"
            :title="`Reroll ${singular.toLowerCase()} ${index + 1}`"
            @click="emit('reroll', index)"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
              focusable="false"
            >
              <path d="M20 7v5h-5M20 12a8 8 0 1 0-2.3 5.7" />
            </svg>
          </UiButton>
        </div>
        <UiShadeRating
          v-if="id !== 'spells' && entry.value !== undefined"
          v-model="entry.value"
          :disabled="locked"
          :label="`${singular} ${index + 1} level`"
        />
        <UiButton
          v-if="!locked"
          class="remove-entry"
          variant="secondary"
          :aria-label="`Remove ${singular.toLowerCase()} ${index + 1}`"
          @click="remove(index)"
          >×</UiButton
        >
      </div>
    </div>
  </UiSheetCard>
</template>

<style scoped>
.entries {
  display: grid;
  gap: var(--space-3);
  min-width: 0;
}
.entry {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto var(--control-height);
  gap: var(--space-2);
  align-items: end;
  min-width: 0;
}
.entry.unrated {
  grid-template-columns: minmax(0, 1fr) var(--control-height);
}
.entry.locked {
  grid-template-columns: minmax(0, 1fr) auto;
}
.entry.locked.unrated {
  grid-template-columns: minmax(0, 1fr);
}
.description-field {
  position: relative;
  min-width: 0;
}
.description-field.rerollable :deep(.sheet-field) {
  padding-right: calc(1.75rem + var(--space-1));
}
.reroll {
  position: absolute;
  bottom: 0;
  right: 0;
  display: grid;
  place-items: center;
  width: 1.75rem;
  height: var(--control-height);
  padding: 0;
  border: 0;
  background: transparent;
}
.reroll::before,
.reroll::after {
  display: none;
}
.remove-entry {
  --button-padding-inline: 0;
  --button-font-size: 1.25rem;
  min-width: var(--control-height);
  height: var(--control-height);
  padding: 0;
  line-height: 1;
}
</style>
