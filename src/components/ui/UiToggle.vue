<script setup lang="ts">
defineProps<{ modelValue: boolean; label: string; hazard?: boolean; inputLabel?: string }>()
defineEmits<{ 'update:modelValue': [value: boolean] }>()
</script>
<template>
  <label :class="{ hazard }">
    <input
      type="checkbox"
      :aria-label="inputLabel ?? label"
      :checked="modelValue"
      @change="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <span class="track" aria-hidden="true"></span>
    <span>{{ label }}</span>
  </label>
</template>
<style scoped>
label {
  transition: var(--control-color-transition);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  min-height: var(--control-height);
  min-width: var(--control-height);
  cursor: pointer;
  -webkit-user-select: none;
  user-select: none;
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
label:hover {
  color: var(--color-signal);
}
label:hover .track {
  border-color: var(--color-signal);
}
label:hover input:not(:checked) + .track {
  background: color-mix(in srgb, var(--color-signal) 16%, var(--color-surface));
}
label:hover input:checked + .track {
  background: var(--color-accent-hover);
}
input:focus-visible + .track {
  outline: var(--control-focus-width) solid var(--control-focus-color, var(--color-focus));
  outline-offset: 3px;
}
label.hazard {
  flex-direction: row;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border: 1px solid currentColor;
  font-size: var(--font-small-control-size);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: inherit;
}
label.hazard .track {
  width: 2.75rem;
  height: 1.25rem;
  padding: 0;
  border: 1px solid var(--color-control-border);
  background: repeating-linear-gradient(
    135deg,
    var(--color-muted) 0 4px,
    var(--color-surface) 4px 8px
  );
  clip-path: none;
}
label.hazard .track::before,
label.hazard .track::after {
  display: none;
}
label.hazard input:checked + .track {
  border-color: var(--color-on-accent);
  background: repeating-linear-gradient(
    135deg,
    var(--color-on-accent) 0 4px,
    var(--color-hot) 4px 8px
  );
}
label.hazard:hover {
  background-image: repeating-linear-gradient(
    135deg,
    color-mix(in srgb, currentColor 12%, transparent) 0 8px,
    transparent 8px 16px
  );
}
@media screen and (max-width: 24rem) {
  label.hazard {
    padding-inline: var(--space-1);
    white-space: nowrap;
  }
  label.hazard .track {
    width: 2rem;
  }
}
@media (forced-colors: active) {
  input {
    position: static;
    width: 1.25rem;
    height: 1.25rem;
    opacity: 1;
    appearance: auto;
  }
  .track,
  label.hazard .track {
    display: none;
  }
  label:has(input:focus-visible) {
    outline: 3px solid Highlight;
    outline-offset: 3px;
  }
}
</style>
