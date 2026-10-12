<script setup lang="ts">
defineProps<{ label: string; options: string[] }>()
const selected = defineModel<string[]>({ required: true })
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
.expertise-choice:last-child span::after {
  content: '';
}
.expertise-choice:nth-child(3n + 2) span {
  border-bottom-style: dotted;
}
input:checked + span {
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
@media (forced-colors: active) {
  input {
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
