<script setup lang="ts">
defineProps<{ label: string; options: string[] }>()
const selected = defineModel<string[]>({ required: true })
const custom = defineModel<string>('custom')
</script>

<template>
  <div class="expertise-choices" role="group" :aria-label="`${label} expertises`">
    <label v-for="option in options" :key="option" class="expertise-choice">
      <input
        v-model="selected"
        type="checkbox"
        :value="option"
        :aria-label="`${label} expertise: ${option}`"
      />
      <span>{{ option }}</span>
    </label>
    <label class="custom-expertise" :class="{ filled: custom?.trim() }">
      <input v-model="custom" type="text" placeholder="Custom" :aria-label="`${label} custom expertise`" />
      <span v-if="custom?.trim()" class="custom-print-value">{{ custom }}</span>
    </label>
  </div>
</template>

<style scoped>
.expertise-choices {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
  gap: var(--space-1) var(--space-2);
  min-width: 0;
}
.expertise-choice {
  position: relative;
  display: flex;
  min-width: 0;
  max-width: 100%;
  cursor: pointer;
  align-self: flex-start;
}
input[type='checkbox'] {
  position: absolute;
  width: 1px;
  height: 1px;
  min-height: 0;
  opacity: 0;
}
span {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  min-height: var(--control-height);
  padding: var(--space-1) var(--space-2);
  border-bottom: 1px dashed currentColor;
  color: inherit;
  font-family: var(--font-expertise);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: 0.055em;
  text-transform: uppercase;
  text-shadow: 1px 0 color-mix(in srgb, currentColor 30%, transparent);
  overflow-wrap: anywhere;
  transition: var(--control-color-transition);
}
span::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  font-size: 0.625rem;
}
span::after {
  content: ',';
  margin-left: calc(-1 * var(--space-1));
  color: inherit;
}
.expertise-choice:has(+ .custom-expertise) span::after {
  content: '';
}
.expertise-choice:nth-child(3n + 2) span {
  border-bottom-style: dotted;
}
input:checked + span,
.custom-expertise.filled input {
  background: var(--color-rating-one);
  background-image: repeating-linear-gradient(
    0deg,
    transparent 0 3px,
    color-mix(in srgb, var(--color-on-accent) 10%, transparent) 3px 4px
  );
  border-color: var(--color-on-accent);
  color: var(--color-on-accent);
  text-shadow: none;
  box-shadow: 2px 2px 0 var(--color-on-accent);
}
input:checked + span::before {
  content: '✓';
}
.expertise-choice:hover span {
  border-bottom-style: solid;
  text-decoration: underline;
  text-underline-offset: 0.2em;
}
input:checked + span::after {
  color: inherit;
}
input:focus-visible + span {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}
.custom-expertise {
  position: relative;
  flex: 1 1 5rem;
  min-width: 0;
  max-width: 100%;
}
.custom-expertise input {
  width: 100%;
  min-width: 0;
  min-height: var(--control-height);
  padding: var(--space-1) var(--space-2);
  border: 0;
  border-bottom: 1px dashed currentColor;
  border-radius: 0;
  background: transparent;
  color: inherit;
  font-family: var(--font-expertise);
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: 0.055em;
  text-transform: uppercase;
}
.custom-expertise input::placeholder {
  color: var(--color-muted);
  opacity: 1;
}
.custom-expertise.filled::before {
  content: '✓';
  position: absolute;
  top: 0;
  left: 0;
  color: var(--color-on-accent);
  font-size: 0.625rem;
  pointer-events: none;
}
.custom-expertise input:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}
.custom-print-value {
  display: none;
}
@media print {
  .custom-expertise:not(.filled),
  .custom-expertise input {
    display: none;
  }
  .custom-expertise.filled {
    flex: 0 1 auto;
  }
  .custom-print-value {
    display: flex;
    white-space: pre-wrap;
  }
  .custom-print-value::after {
    content: '';
  }
}
@media (forced-colors: active) {
  input[type='checkbox'] {
    position: static;
    width: 1.25rem;
    height: 1.25rem;
    opacity: 1;
    appearance: auto;
    align-self: center;
  }
  span::before {
    display: none;
  }
}
</style>
