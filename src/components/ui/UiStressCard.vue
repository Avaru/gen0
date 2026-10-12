<script setup lang="ts">
import { cbrPnkStressComplications } from '@/data/characters/cbr-pnk-sheet'

const stress = defineModel<number>({ required: true })
function change(position: number, event: Event) {
  stress.value = (event.target as HTMLInputElement).checked ? position : position - 1
}
</script>

<template>
  <section class="stress-card" aria-labelledby="stress-heading">
    <h2 id="stress-heading">Stress</h2>
    <p class="costs">
      <span>Push: ⚡⚡</span><span aria-hidden="true">/</span>
      <span>Assist: ⚡</span><span aria-hidden="true">/</span>
      <span>Flashback: ⚡ or ⚡⚡+</span>
    </p>
    <div class="track" role="group" aria-label="Stress slots">
      <label v-for="position in 7" :key="position" :class="{ last: position === 7 }">
        <input
          type="checkbox"
          :checked="stress >= position"
          :aria-label="`Stress slot ${position}`"
          @change="change(position, $event)"
        />
        <span aria-hidden="true" />
      </label>
    </div>
    <div class="overload" :class="{ active: stress === 7 }">
      <p>
        <strong>Overload</strong> When you mark your last ⚡, an Approach of your choosing becomes
        permanently <strong>Glitched</strong> and immediately incurs a complication, such as:
      </p>
      <ul>
        <li v-for="complication in cbrPnkStressComplications" :key="complication">
          {{ complication }}
        </li>
      </ul>
      <p>
        While <strong>overloaded</strong> you can’t perform actions that would require ⚡.
        <strong>Take a breather</strong> to relieve ⚡ and clear this status.
      </p>
    </div>
  </section>
</template>

<style scoped>
.stress-card {
  position: relative;
  min-width: 0;
  padding: var(--space-6);
  border: var(--theme-panel-border-width) solid var(--color-border);
  border-top: var(--theme-panel-rule-width) solid var(--color-hot);
  border-radius: var(--radius-lg);
  box-shadow: var(--theme-panel-shadow);
  background: var(--theme-panel-fill);
  background-image: var(--theme-panel-texture);
  color: var(--color-text);
}
.stress-card::after {
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
.costs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  font-size: var(--font-small-control-size);
  text-transform: uppercase;
}
.track {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  position: relative;
  margin-block: var(--space-6);
  padding-block: var(--space-2);
}
.track::before {
  content: '';
  position: absolute;
  top: 50%;
  left: calc(100% / 14);
  right: calc(100% / 14);
  height: 2px;
  background: var(--color-text);
}
.track label {
  position: relative;
  display: grid;
  place-items: center;
  min-height: var(--control-height);
  cursor: pointer;
}
.track input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: inherit;
}
.track span {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--color-text);
  background: var(--theme-panel-fill);
  transform: rotate(45deg);
  pointer-events: none;
  transition: var(--control-color-transition);
}
.track .last span {
  outline: 2px solid var(--color-muted);
  outline-offset: 4px;
}
.track input:checked + span {
  background: var(--color-signal);
}
.track .last input:checked + span {
  background: var(--color-hot);
}
.track input:focus-visible + span {
  outline: 3px solid var(--color-focus);
  outline-offset: 4px;
}
.track label:hover span {
  box-shadow: 0 0 0 2px var(--color-text);
}
.overload {
  font-size: var(--font-small-control-size);
  line-height: 1.5;
}
.overload strong {
  text-transform: uppercase;
}
.overload.active strong {
  color: var(--color-hot);
}
ul {
  margin-block: var(--space-4);
  padding-left: var(--space-6);
  list-style-type: '▸ ';
}
li + li {
  margin-top: var(--space-1);
}
@media (max-width: 24rem) {
  .stress-card {
    padding: var(--space-4);
  }
  .track {
    grid-template-columns: repeat(7, var(--control-height));
    overflow-x: auto;
  }
  .track::before {
    left: calc(var(--control-height) / 2);
    right: auto;
    width: calc(6 * var(--control-height));
  }
}
@media (forced-colors: active) {
  .track input {
    position: static;
    width: 1.5rem;
    height: 1.5rem;
    min-height: 0;
    opacity: 1;
    appearance: auto;
  }
  .track span,
  .track::before {
    display: none;
  }
}
</style>
