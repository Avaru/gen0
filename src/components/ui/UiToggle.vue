<script setup lang="ts">
defineProps<{ modelValue: boolean; label: string }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>
<template>
  <label>
    <input
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span class="track" aria-hidden="true"></span>
    <span>{{ label }}</span>
  </label>
</template>
<style scoped>
label {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  min-height: var(--control-height);
  min-width: var(--control-height);
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 650;
}
input {
  position: absolute;
  width: 1px;
  height: 1px;
  min-height: 0;
  opacity: 0;
}
.track {
  transition: var(--control-color-transition);
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: 2.25rem;
  height: 1.25rem;
  padding: 2px;
  border: 1px solid var(--color-control-border);
  border-radius: var(--radius-sm);
  background: var(--color-subtle);
}
.track::after {
  transition: var(--control-color-transition);
  content: '';
  width: 0.75rem;
  height: 0.75rem;
  border-radius: var(--radius-sm);
  background: var(--color-muted);
}
input:checked + .track {
  background: var(--color-accent);
  border-color: var(--color-accent);
}
input:checked + .track::after {
  margin-left: auto;
  background: var(--color-on-accent);
}
input:focus-visible + .track {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}
[data-theme='cyberpunk2077'] label {
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.035em;
}
[data-theme='cyberpunk2077'] .track {
  width: 2.5rem;
  height: 1rem;
  padding: 0;
  border: 0;
  background: var(--color-control-border);
  clip-path: var(--theme-check-shape);
  position: relative;
}
[data-theme='cyberpunk2077'] .track::before {
  transition: var(--control-color-transition);
  content: '';
  position: absolute;
  inset: 1px;
  background: var(--color-surface);
  clip-path: var(--theme-check-shape);
}
[data-theme='cyberpunk2077'] .track::after {
  position: relative;
  width: 50%;
  height: 100%;
  background: var(--color-hot);
  clip-path: var(--theme-check-shape);
}
[data-theme='cyberpunk2077'] input:checked + .track::after {
  background: var(--color-signal);
}
[data-theme='cyberpunk2077'] input:focus-visible ~ span:last-child {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}
</style>
