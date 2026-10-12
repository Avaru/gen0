<script setup lang="ts">
import UiDiamondChoice from './UiDiamondChoice.vue'
const specialArmor = defineModel<boolean>({ required: true })
</script>

<template>
  <section
    class="resistance-card"
    :data-state="specialArmor ? 'yellow' : 'empty'"
    aria-labelledby="resistance-heading"
  >
    <h2 id="resistance-heading">Resist/Armor</h2>
    <p class="rule">
      Convey how you are RESISTING to reduce the severity of a Consequence or, at the GM’s
      discretion, avoid it entirely. Then choose a method:
    </p>
    <div class="methods">
      <div class="deplete">
        <p class="method-heading">Mark and deplete either a fitting type of armor or</p>
        <UiDiamondChoice v-model="specialArmor" class="special-armor" label="Special Armor">
          special armor
        </UiDiamondChoice>
        <p class="example">
          E.g. Envision a defensive use for your Augmentation // what does the armor look like?
        </p>
      </div>
      <div class="roll">
        <p class="method-heading">
          Roll the appropriate APPROACH (don’t add Skill this time), + if you opt to deplete a
          relevant Gear:
        </p>
        <ul class="outcomes">
          <li>6,6 EZ. THAT’S IT.</li>
          <li>6 SOLID. MARK <span aria-label="1 stress">⚡︎</span>.</li>
          <li>4/5 NOT BAD. MARK <span aria-label="2 stress">⚡︎⚡︎</span>.</li>
          <li>1–3 CLOSE. MARK <span aria-label="3 stress">⚡︎⚡︎⚡︎</span>.</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.resistance-card {
  position: relative;
  min-width: 0;
  padding: var(--space-6);
  color: var(--color-text);
  background: var(--theme-panel-fill);
  background-image: var(--theme-panel-texture);
  border: var(--theme-panel-border-width) solid var(--color-border);
  border-top: var(--theme-panel-rule-width) solid var(--color-signal);
  border-radius: var(--radius-lg);
  box-shadow: var(--theme-panel-shadow);
  transition: var(--control-color-transition);
  container-type: inline-size;
}
.resistance-card[data-state='yellow'] {
  color: var(--color-on-accent);
  background-color: var(--color-rating-one);
  --diamond-selected: var(--color-on-accent);
  --diamond-selected-decoration: underline;
}
.resistance-card::after {
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
  text-transform: uppercase;
  letter-spacing: -0.02em;
  color: var(--theme-title-color);
  text-shadow: var(--theme-heading-shadow);
  overflow-wrap: anywhere;
}
[data-state='yellow'] h2 {
  color: inherit;
  text-shadow: none;
}
.rule,
.example {
  font-size: var(--font-sheet-rule-size);
  line-height: 1.35;
}
.rule {
  margin-bottom: var(--space-4);
}
.methods {
  display: grid;
  gap: var(--space-6);
}
.methods > div {
  min-width: 0;
}
.method-heading,
.special-armor {
  font-family: var(--font-display);
  font-size: var(--font-small-control-size);
  font-weight: 650;
  text-transform: uppercase;
  line-height: 1.35;
}
.method-heading {
  font-size: var(--font-sheet-rule-size);
  margin-bottom: var(--space-3);
}
.special-armor {
  padding-inline: var(--space-3);
  border: 1px solid currentColor;
}
.special-armor :deep(.item-text) {
  font-size: var(--font-small-control-size);
}
.example {
  margin-top: var(--space-2);
}
.outcomes {
  font-size: var(--font-sheet-rule-size);
  line-height: 1.35;
  margin-block: var(--space-4);
  padding-left: var(--space-6);
  list-style-type: '▸ ';
}
.outcomes li + li {
  margin-top: var(--space-1);
}
@container (min-width: 30rem) {
  .methods {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 24rem) {
  .resistance-card {
    padding: var(--space-4);
  }
}
@media print {
  .methods {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .rule,
  .example,
  .method-heading,
  .special-armor,
  .outcomes {
    font-size: 6.5pt;
  }
  .special-armor {
    min-height: 5mm;
  }
}
</style>
