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
  align-items: center;
  gap: var(--space-3);
  min-height: var(--control-height);
  cursor: pointer;
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
  width: 2.75rem;
  height: 1.5rem;
  padding: 2px;
  border: 1px solid var(--color-control-border);
  border-radius: var(--radius-sm);
  background: var(--color-subtle);
}
.track::after {
  transition: var(--control-color-transition);
  content: '';
  width: 1rem;
  height: 1rem;
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
  width: 3rem;
  height: 1.125rem;
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
