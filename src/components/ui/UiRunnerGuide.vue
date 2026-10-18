<script setup lang="ts">
import UiSheetSymbol from './UiSheetSymbol.vue'
import UiSheetCard from './UiSheetCard.vue'
import UiButton from './UiButton.vue'

defineProps<{ showDiceGuide?: boolean }>()
const showRollGuide = defineModel<boolean>('showRollGuide', { default: false })

function interpretResults() {
  document.getElementById('action-roll-heading')?.scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    block: 'start',
  })
}
</script>

<template>
  <UiSheetCard class="file-runner" title="File a runner" heading-id="file-runner-heading">
    <ol class="rules">
      <li>Enter a <strong>Handle</strong>—what they call you on the Grid and streets alike.</li>
      <li>Enter a few evocative words to describe your <strong>Look</strong>.</li>
      <li>
        You risk it all for a reason. What’s in it for you? Choose an
        <strong>Angle</strong> and detail it briefly.
      </li>
      <li>
        Assign
        <span class="approach-rating" role="img" aria-label="two pluses"
          ><UiSheetSymbol kind="dice" /><UiSheetSymbol kind="dice" /></span
        >,
        <span class="approach-rating" role="img" aria-label="one plus"
          ><UiSheetSymbol kind="dice" /></span
        >, and
        <span class="approach-rating" role="img" aria-label="one plus"
          ><UiSheetSymbol kind="dice"
        /></span>
        in any order to three of your <strong>Approaches</strong>.
      </li>
      <li>
        Distribute <strong>8 dice</strong> over your <strong>Skills</strong>. To assign an
        <strong>Expertise</strong>, spend a third die on a particular Skill—choose or write the
        Expertise down aside.
      </li>
      <li>
        <p>
          Define your starting <strong>Signature Augmentation</strong> by writing down its
          model/brand and an outline of its primary feature,
          <em>e.g. Ashide™ Racing Legs.</em>
        </p>
      </li>
      <li>
        Don’t pick your <strong>Gear</strong> just yet—you’ll decide what you are carrying on the
        fly during the Run. For now, just circle on the list the ones you are interested in, for
        easy referencing later.
      </li>
    </ol>
    <div v-if="showDiceGuide" class="roll-guide">
      <h3>How to</h3>
      <div class="roll-guide-actions">
        <UiButton
          class="roll-guide-button"
          variant="secondary"
          :aria-expanded="showRollGuide"
          aria-controls="dice-roll-guide"
          @click="showRollGuide = !showRollGuide"
          >Roll</UiButton
        >
        <UiButton class="roll-guide-button" variant="secondary" @click="interpretResults"
          >Interpret results</UiButton
        >
      </div>
    </div>
    <div v-if="showDiceGuide && showRollGuide" id="dice-roll-guide" class="roll-explanation">
      <p class="rule">
        Add the dice from your chosen Approach and Skill, then roll that many dice. Roll two and
        take the lowest when the no of dice would be 0.
      </p>
      <div
        class="dice-equation"
        role="img"
        aria-label="Approach dice plus Skill dice equals the number of dice to roll"
      >
        <span class="equation-factor approach-factor" aria-hidden="true">
          <span class="equation-approach">
            <span class="equation-die"><UiSheetSymbol kind="dice" :framed="false" /></span>
            <span class="equation-die"><UiSheetSymbol kind="dice" :framed="false" /></span>
          </span>
          <span class="factor-label">Approach</span>
        </span>
        <span aria-hidden="true">+</span>
        <span class="equation-factor skill-factor" aria-hidden="true">
          <span class="equation-skill">
            <span class="equation-die"><UiSheetSymbol kind="dice" :framed="false" /></span>
          </span>
          <span class="factor-label">Skill</span>
        </span>
        <span aria-hidden="true">=</span>
        <span class="equation-result" aria-hidden="true">Amount of D6 rolled</span>
      </div>
    </div>
  </UiSheetCard>
</template>

<style scoped>
.file-runner {
  display: flex;
  flex-direction: column;
  overflow-wrap: anywhere;
}
.file-runner ol {
  margin: 0;
  padding-left: 2rem;
  list-style-type: decimal-leading-zero;
}
.file-runner li {
  padding-left: var(--space-2);
}
.file-runner li::marker {
  color: var(--color-signal);
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 800;
}
.file-runner li + li,
.file-runner p + p {
  margin-top: var(--space-4);
}
.approach-rating {
  white-space: nowrap;
}
.dice-equation {
  --sheet-symbol-ink: currentColor;
  --sheet-symbol-square: currentColor;
  display: flex;
  align-items: start;
  justify-content: flex-start;
  gap: clamp(0.3rem, 0.7vw, 0.75rem);
  padding-top: var(--space-4);
  color: var(--color-text);
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2.8vw, 2.75rem);
  font-weight: 800;
  line-height: 1;
  white-space: nowrap;
  pointer-events: none;
}
.equation-result {
  font-size: 0.65em;
  text-transform: uppercase;
  line-height: 1.5;
}
.roll-guide-button {
  --button-font-size: 1rem;
  --button-padding-inline: var(--space-3);
  padding-block: var(--space-1);
  min-height: 2.25rem;
}
.roll-guide {
  padding-top: var(--space-4);
}
.roll-guide h3 {
  margin: 0 0 var(--space-2);
  color: var(--color-signal);
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: var(--theme-name-weight);
  text-transform: uppercase;
}
.roll-guide-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.roll-explanation {
  align-self: center;
  width: min(100%, 32rem);
  padding-top: var(--space-4);
  transform: rotate(-2deg);
}
.roll-explanation .rule {
  margin: 0;
  font-size: var(--font-sheet-rule-size);
  line-height: 1.35;
}
.equation-approach,
.equation-skill {
  display: inline-flex;
  gap: 0.1em;
}
.equation-factor {
  display: grid;
  justify-items: center;
  gap: var(--space-2);
}
.approach-factor {
  color: var(--color-hot);
}
.skill-factor {
  color: var(--color-signal);
}
.equation-die {
  --sheet-symbol-ink: var(--color-text);
  display: grid;
  place-items: center;
  width: 1em;
  height: 1em;
  border: solid currentColor;
  border-width: 1px 3px 4px 1px;
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, currentColor 25%, transparent);
}
.equation-die :deep(.sheet-symbol) {
  width: 0.65em;
  height: 0.65em;
}
.factor-label {
  font-family: var(--font-body);
  font-size: clamp(0.5rem, 0.75vw, 0.65rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

@media print {
  .file-runner {
    display: none !important;
  }
}
</style>
