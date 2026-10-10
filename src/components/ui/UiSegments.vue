<script setup lang="ts" generic="Value extends string">
defineProps<{
  modelValue: Value
  label: string
  name: string
  options: readonly { value: Value; label: string }[]
}>()
defineEmits<{ 'update:modelValue': [value: Value] }>()
</script>
<template>
  <fieldset>
    <legend>{{ label }}</legend>
    <div class="segments">
      <label v-for="option in options" :key="option.value">
        <input
          type="radio"
          :name="name"
          :value="option.value"
          :checked="modelValue === option.value"
          @change="$emit('update:modelValue', option.value)"
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
legend::before {
  content: '';
  display: inline-block;
  width: 7px;
  height: 7px;
  margin-right: var(--space-2);
  background: var(--theme-label-mark);
}
.segments {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  padding: 0;
  border: 1px solid var(--color-control-border);
  background: transparent;
  border-radius: var(--radius-sm);
}
label {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  cursor: pointer;
}
input {
  position: absolute;
  width: 1px;
  height: 1px;
  min-height: 0;
  opacity: 0;
}
span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: var(--control-height);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  border-bottom: 2px solid transparent;
  text-align: center;
  font-size: var(--font-control-size);
  font-weight: 600;
}
input:checked + span {
  background: var(--color-signal);
  color: var(--color-on-accent);
}
input:focus-visible + span {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}
[data-theme='cyberpunk2077'] span {
  text-transform: uppercase;
  color: var(--color-hot);
  border-bottom-color: var(--color-hot);
}
[data-theme='cyberpunk2077'] .segments {
  padding: 0;
  border: 0;
  background: transparent;
}
[data-theme='cyberpunk2077'] input:checked + span {
  color: var(--color-signal);
  background: transparent;
  border-bottom-color: var(--color-signal);
}
[data-theme='cyberpunk2077'] label:hover span {
  background: var(--color-subtle);
}
@media (max-width: 24rem) {
  span {
    padding-inline: var(--space-1);
    font-size: var(--font-small-control-size);
  }
}
</style>
