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
    <span class="track" :class="{ 'control-shimmer': !hazard }" aria-hidden="true"></span>
    <span class="toggle-text">{{ label }}</span>
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
.toggle-text {
  pointer-events: none;
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
  background-color: #fff;
  color: var(--color-on-accent);
  background-image: repeating-linear-gradient(
    135deg,
    color-mix(in srgb, currentColor 12%, transparent) 0 8px,
    transparent 8px 16px
  );
}
@media screen {
  label.hazard {
    overflow: hidden;
  }
}
@media screen and (prefers-reduced-motion: no-preference) {
  label.hazard:where([data-theme='cyberpunk'] *) .toggle-text {
    position: relative;
    z-index: 1;
    transition: transform 60ms ease-out;
  }
  label.hazard:where([data-theme='cyberpunk'] *)::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0;
    background:
      repeating-linear-gradient(0deg, currentColor 0 1px, transparent 1px 3px),
      repeating-linear-gradient(
        113deg,
        transparent 0 5px,
        currentColor 5px 7px,
        transparent 7px 11px
      );
    background-size:
      100% 7px,
      17px 13px;
  }
  @media (hover: hover) {
    label.hazard:where([data-theme='cyberpunk'] *):hover .toggle-text {
      transform: translateX(3px) scale(1.15, 0.9);
      animation: hover-text-glitch 240ms steps(1, end);
    }
    label.hazard:where([data-theme='cyberpunk'] *):hover::before {
      animation: hover-noise-glitch 240ms steps(1, end);
    }
  }
}
@keyframes hover-text-glitch {
  0% {
    transform: translate(-12%, 2px) scale(1.6, 0.6) skewX(-18deg);
  }
  18% {
    transform: translate(65%, -4px) scale(2.2, 1.25) skewX(24deg);
  }
  36% {
    transform: translate(-80%, 3px) scale(0.8, 1.6) skewX(-30deg);
  }
  54% {
    transform: translate(20%, -2px) scale(1.9, 0.5);
  }
  72% {
    transform: translate(-8%, 1px) scale(1.35, 1.3) skewX(12deg);
  }
  100% {
    transform: translateX(3px) scale(1.15, 0.9);
  }
}
@keyframes hover-noise-glitch {
  0%,
  36%,
  72% {
    opacity: 0.38;
    background-position:
      7px -3px,
      -11px 5px;
  }
  18%,
  54% {
    opacity: 0.08;
    background-position:
      -5px 4px,
      8px -7px;
  }
  100% {
    opacity: 0;
  }
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
label:not(.hazard):where([data-theme='never-midnight'] *) .track {
  border: 2px solid var(--color-ritual);
  border-image: var(--theme-control-border) 1;
}
label:not(.hazard):where([data-theme='never-midnight'] *) input:checked + .track {
  background: var(--color-ritual);
}
label:not(.hazard):where([data-theme='never-midnight'] *) .track {
  border-width: 0 0 3px 2px;
  position: relative;
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
