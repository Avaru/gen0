<script setup lang="ts" generic="Value extends string">
const props = defineProps<{
  modelValue: readonly Value[]
  label: string
  hideLabel?: boolean
  name: string
  options: readonly { value: Value; label: string }[]
}>()
const emit = defineEmits<{ 'update:modelValue': [value: Value[]] }>()

function change(value: Value, event: Event) {
  const input = event.target as HTMLInputElement
  const selected = new Set(props.modelValue)
  if (input.checked) selected.add(value)
  else selected.delete(value)
  if (!selected.size) {
    for (const option of props.options) {
      if (option.value !== value) selected.add(option.value)
    }
  }
  emit(
    'update:modelValue',
    props.options.filter((option) => selected.has(option.value)).map((option) => option.value),
  )
}
</script>

<template>
  <fieldset>
    <legend :class="{ 'visually-hidden': hideLabel }">{{ label }}</legend>
    <div class="choices">
      <label v-for="option in options" :key="option.value">
        <input
          type="checkbox"
          :name="name"
          :value="option.value"
          :checked="modelValue.includes(option.value)"
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
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
label {
  transition: var(--control-color-transition);
  display: flex;
  align-items: center;
  gap: var(--space-2);
  min-height: var(--control-height);
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-control-border);
  border-radius: var(--radius-sm);
  background: var(--color-subtle);
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  font-size: var(--font-control-size);
  font-weight: 600;
}
label:has(input:checked) {
  border-color: var(--color-signal);
  background: var(--color-surface);
}
label:hover {
  color: var(--color-signal);
  border-color: var(--color-signal);
  background: color-mix(in srgb, var(--color-signal) 16%, var(--color-surface));
}
label:has(input:focus-visible) {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}
input {
  transition: var(--control-color-transition);
  appearance: none;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 1.125rem;
  height: 1.125rem;
  min-height: 0;
  margin: 0;
  border: 1px solid var(--color-control-border);
  border-radius: 0;
  background: var(--color-surface);
  clip-path: var(--theme-check-shape);
  cursor: inherit;
}
input::after {
  transition: var(--control-color-transition);
  content: '';
  width: 0.3rem;
  height: 0.6rem;
  margin-top: -2px;
  border: solid var(--color-on-accent);
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
  visibility: hidden;
}
input:checked {
  border-color: var(--color-signal);
  background: var(--color-signal);
}
input:checked::after {
  visibility: visible;
}
@media (forced-colors: active) {
  input {
    appearance: auto;
    clip-path: none;
  }
  input::after {
    display: none;
  }
}
</style>
