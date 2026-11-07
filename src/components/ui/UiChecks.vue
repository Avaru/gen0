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
  <fieldset class="checks">
    <legend :class="{ 'visually-hidden': hideLabel }">{{ label }}</legend>
    <div class="choices">
      <label v-for="option in options" :key="option.value" class="control-shimmer">
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
  font-family: var(--font-choice, inherit);
  font-size: var(--font-choice-size, 0.8125rem);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: var(--font-choice-weight, 600);
  line-height: var(--line-height-choice, normal);
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
  border: var(--checks-label-border-width, 1px) solid var(--color-control-border);
  border-radius: var(--radius-sm);
  background: var(--checks-label-fill, var(--color-subtle));
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
  font-family: var(--font-choice, inherit);
  font-size: var(--font-choice-size, var(--font-control-size));
  font-weight: var(--font-choice-weight, 600);
  line-height: var(--line-height-choice, normal);
}
label:has(input:checked) {
  border-color: var(--color-signal);
  background: var(--checks-label-checked-fill, var(--color-surface));
}
label:is(:hover, :has(input:focus-visible)):not(:active) {
  color: var(--control-hover-ink, var(--color-signal));
  border-color: var(--color-signal);
  background: var(
    --control-hover-fill,
    color-mix(in srgb, var(--color-signal) 16%, var(--color-surface))
  );
}
label:has(input:focus-visible) {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}
label:has(input):active {
  color: var(--control-active-ink, var(--color-signal));
  background: var(--control-active-texture, none) var(--control-active-fill, var(--color-surface));
}
label:not(:active):is(:hover, :has(input:focus-visible)) input {
  filter: var(--control-indicator-hover-filter, none);
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
  border: var(--checks-input-border-width, 1px) solid var(--color-control-border);
  border-radius: 0;
  background: var(--checks-input-fill, var(--color-surface));
  clip-path: var(--theme-check-shape);
  cursor: inherit;
}
input::after {
  display: var(--checks-mark-display, block);
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
  background: var(--checks-input-checked-fill, var(--color-signal));
}
input:checked::after {
  visibility: visible;
}
label:where([data-theme='never-midnight'] *),
input:where([data-theme='never-midnight'] *) {
  border: 2px solid var(--color-ritual);
  border-image: var(--theme-control-border) 1;
}
input:where([data-theme='never-midnight'] *) {
  border-width: 0 0 2px 1px;
  background: transparent;
}
input:where([data-theme='never-midnight'] *):checked {
  background: var(--color-ritual);
}
label:where([data-theme='never-midnight'] *),
label:where([data-theme='never-midnight'] *):has(input:checked) {
  background: var(--theme-control-wash);
}
label:where([data-theme='never-midnight'] *):is(:hover, :active),
label:where([data-theme='never-midnight'] *):has(input:checked):is(:hover, :active) {
  background: var(--theme-control-wash-hover);
}
label:where([data-theme='never-midnight'] *) {
  border-width: 0 0 3px 2px;
  position: relative;
}

@media (forced-colors: active) {
  label:where([data-theme='never-midnight'] *),
  input:where([data-theme='never-midnight'] *) {
    border-image: none;
    border-color: ButtonText;
  }
  input {
    appearance: auto;
    clip-path: none;
  }
  input::after {
    display: none;
  }
}
</style>
