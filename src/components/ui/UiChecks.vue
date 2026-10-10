<script setup lang="ts">
const props = defineProps<{
  modelValue: readonly string[]
  label: string
  name: string
  options: readonly { value: string; label: string }[]
}>()
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>()

function change(value: string, event: Event) {
  const input = event.target as HTMLInputElement
  const selected = new Set(props.modelValue)
  if (input.checked) selected.add(value)
  else selected.delete(value)
  if (!selected.size) {
    input.checked = true
    return
  }
  emit('update:modelValue', props.options.filter((option) => selected.has(option.value)).map((option) => option.value))
}
</script>

<template>
  <fieldset>
    <legend>{{ label }}</legend>
    <div class="choices">
      <label v-for="option in options" :key="option.value">
        <input
          type="checkbox"
          :name="name"
          :value="option.value"
          :checked="modelValue.includes(option.value)"
          :disabled="modelValue.length === 1 && modelValue.includes(option.value)"
          @change="change(option.value, $event)"
        />
        <span>{{ option.label }}</span>
      </label>
    </div>
  </fieldset>
</template>

<style scoped>
fieldset {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
legend {
  padding: 0;
  margin-bottom: var(--space-2);
  color: var(--color-muted);
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}
.choices {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-height: var(--control-height);
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-control-border);
  border-radius: var(--radius-sm);
  background: var(--color-subtle);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
}
label:has(input:checked) {
  border-color: var(--color-signal);
  background: var(--color-surface);
}
input {
  width: 1.125rem;
  height: 1.125rem;
  min-height: 0;
  margin: 0;
  accent-color: var(--color-signal);
}
input:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}
</style>
