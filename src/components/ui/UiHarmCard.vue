<script setup lang="ts">
import { computed } from 'vue'
import type { CharacterHarm } from '@/data/characters/types'

const harm = defineModel<CharacterHarm[]>({ required: true })
const state = computed(() => {
  const lowerLevelsFull = [1, 2].every((level) =>
    harm.value.some((row) => row.level === level && row.marks.every(Boolean)),
  )
  if (lowerLevelsFull || harm.value.some((row) => row.level === 3 && row.marks.some(Boolean)))
    return 'red'
  if (harm.value.some((row) => row.level === 2 && row.marks.some(Boolean))) return 'yellow'
  return harm.value.some((row) => row.level === 1 && row.marks.some(Boolean)) ? 'cyan' : 'empty'
})
</script>

<template>
  <section class="harm-card" :data-state="state" aria-labelledby="harm-heading">
    <h2 id="harm-heading">Harm</h2>
    <p class="rule">
      If you take Harm of a Level already filled, move it on to a greater Harm Level. Whenever a
      HARM would hinder an action, apply its designated PENALTY—when OUT, you can act only if
      ASSISTED or making a PUSH.
    </p>
    <div class="columns" aria-hidden="true">
      <span>Level / Descriptive</span><span>Penalty</span>
    </div>
    <div v-for="row in harm" :key="row.level" class="harm-row">
      <label class="level" :for="`harm-${row.level}`">{{ row.level }}</label>
      <input
        :id="`harm-${row.level}`"
        v-model="row.description"
        class="description"
        type="text"
        :aria-label="`Level ${row.level} harm description`"
      />
      <div class="marks" role="group" :aria-label="`Level ${row.level} harm slots`">
        <label v-for="(_, index) in row.marks" :key="index" class="mark">
          <input
            v-model="row.marks[index]"
            type="checkbox"
            :aria-label="`Level ${row.level} harm slot ${index + 1}`"
          />
          <span aria-hidden="true" />
        </label>
      </div>
      <span class="penalty">{{ row.level === 1 ? '▼E' : row.level === 2 ? '−' : 'OUT' }}</span>
    </div>
  </section>
</template>

<style scoped>
.harm-card {
  --harm-fill: var(--theme-panel-fill);
  --harm-ink: var(--color-text);
  position: relative;
  min-width: 0;
  padding: var(--space-6);
  border: var(--theme-panel-border-width) solid var(--color-border);
  border-top: var(--theme-panel-rule-width) solid var(--color-hot);
  border-radius: var(--radius-lg);
  box-shadow: var(--theme-panel-shadow);
  background: var(--harm-fill);
  background-image: var(--theme-panel-texture);
  color: var(--harm-ink);
  transition: var(--control-color-transition);
}
.harm-card[data-state='cyan'] {
  --harm-fill: var(--color-signal);
  --harm-ink: var(--color-on-accent);
}
.harm-card[data-state='yellow'] {
  --harm-fill: var(--color-rating-one);
  --harm-ink: var(--color-on-accent);
}
.harm-card[data-state='red'] {
  --harm-fill: var(--color-hot);
  --harm-ink: var(--color-on-accent);
}
.harm-card::after {
  content: '';
  position: absolute;
  top: 7px;
  right: var(--space-3);
  width: 3rem;
  height: 5px;
  background: var(--theme-panel-edge);
  pointer-events: none;
}
h2 {
  margin-bottom: var(--space-4);
  font-family: var(--font-display);
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: var(--theme-heading-weight);
  color: var(--theme-title-color);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  text-shadow: var(--theme-heading-shadow);
}
.harm-card:not([data-state='empty']) h2 {
  color: var(--harm-ink);
  text-shadow: none;
}
.rule {
  margin-bottom: var(--space-6);
  font-size: 0.625rem;
  line-height: 1.35;
}
.columns {
  display: flex;
  justify-content: space-between;
  gap: var(--space-2);
  font-size: 0.625rem;
  text-transform: uppercase;
}
.harm-row {
  display: grid;
  grid-template-columns: 1.25rem minmax(0, 1fr) auto 2rem;
  align-items: center;
  gap: var(--space-1);
  padding-block: var(--space-3);
  border-bottom: 1px solid var(--color-control-border);
}
.level {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
}
.description {
  width: 100%;
  min-width: 0;
  padding: var(--space-1);
  border: 0;
  border-bottom: 2px solid currentColor;
  border-radius: 0;
  background: transparent;
  color: var(--harm-ink);
  font-size: var(--font-control-size);
  font-weight: 600;
}
.marks {
  display: flex;
  justify-content: flex-end;
  min-width: calc(2 * var(--control-height));
}
.mark {
  position: relative;
  display: grid;
  place-items: center;
  width: var(--control-height);
  height: var(--control-height);
  cursor: pointer;
}
.mark input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: inherit;
}
.mark span {
  width: 1rem;
  height: 1rem;
  border: 2px solid currentColor;
  transform: rotate(45deg);
  pointer-events: none;
}
.mark input:checked + span {
  background: var(--harm-ink);
}
.mark input:focus-visible + span {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}
.mark:hover span {
  box-shadow: 0 0 0 2px currentColor;
}
.penalty {
  font-size: 0.625rem;
  text-align: right;
  font-weight: 700;
}
@media (max-width: 24rem) {
  .harm-card {
    padding: var(--space-4);
  }
}
@media (forced-colors: active) {
  .mark input {
    position: static;
    width: 1.5rem;
    height: 1.5rem;
    min-height: 0;
    opacity: 1;
    appearance: auto;
  }
  .mark span {
    display: none;
  }
}
</style>
