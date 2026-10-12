<script setup lang="ts">
import UiScrambleText from './UiScrambleText.vue'
</script>

<template>
  <div class="roll-reference-cards">
    <section class="roll-reference-card" aria-labelledby="action-roll-heading">
      <h2 id="action-roll-heading"><UiScrambleText text="Action roll" /></h2>
      <dl class="outcomes">
        <div>
          <dt>6,6</dt>
          <dd><strong>Critical.</strong> They succeed and gain an extra benefit (▲E, uncover a secret, improved position, pinpoint a bounty).</dd>
        </div>
        <div>
          <dt>6</dt>
          <dd><strong>Success.</strong> It goes as well as intended.</dd>
        </div>
        <div>
          <dt>4/5</dt>
          <dd><strong>Partial Success.</strong> Success, but it comes with a Consequence.</dd>
        </div>
        <div>
          <dt>1–3</dt>
          <dd><strong>Failure.</strong> Things go bad as they fail and also suffer a Consequence.</dd>
        </div>
      </dl>
    </section>
    <section class="roll-reference-card" aria-labelledby="glitched-dice-heading">
      <h2 id="glitched-dice-heading"><UiScrambleText text="Glitched dice" /></h2>
      <p>
        Each <strong>GLITCHED</strong> factor used on an Action Roll replaces a normal die with a
        GLITCH die—use a die that’s easily discernible from the rest.
      </p>
      <p>
        After judging the outcome as usual, read the lowest GLITCH separately. On a 1–3, it
        triggers a further Level 2 Consequence that can’t be Resisted; on a 4/5, the additional
        Consequence can be Resisted normally.
      </p>
    </section>
  </div>
</template>

<style scoped>
.roll-reference-cards {
  display: grid;
  grid-column: 1 / -1;
  order: 8;
  gap: var(--space-6);
  min-width: 0;
}
.roll-reference-card {
  min-width: 0;
  color: var(--color-on-page);
  font-size: var(--font-sheet-rule-size);
  line-height: 1.35;
}
h2 {
  margin-bottom: var(--space-4);
  font-family: var(--font-display);
  font-size: 1.625rem;
  font-weight: var(--theme-heading-weight);
  text-transform: uppercase;
  color: inherit;
}
.outcomes {
  margin: 0;
}
.outcomes > div {
  display: grid;
  grid-template-columns: 2.5em minmax(0, 1fr);
  gap: var(--space-2);
}
.outcomes > div + div,
p + p {
  margin-top: var(--space-2);
}
dt {
  font-weight: 700;
}
dd {
  margin: 0;
}
@media screen and (min-width: 56rem) {
  .roll-reference-cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-8);
  }
}
@media print {
  .roll-reference-cards {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 4mm;
    break-inside: avoid;
  }
  .roll-reference-card {
    padding: 0 !important;
    border: 0 !important;
    border-radius: 0;
    background: none !important;
    box-shadow: none !important;
    font-size: 5.5pt;
    line-height: 1.3;
  }
  .roll-reference-card h2 {
    margin-bottom: 1mm;
    font-size: 9pt;
  }
  .outcomes > div + div,
  p + p {
    margin-top: 0.5mm;
  }
}
</style>
