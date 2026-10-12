<script setup lang="ts">
import UiSheetCard from './UiSheetCard.vue'
import UiDiamondChoice from './UiDiamondChoice.vue'
const specialArmor = defineModel<boolean>({ required: true })
</script>

<template>
  <UiSheetCard
    class="resistance-card"
    title="Resist/Armor"
    heading-id="resistance-heading"
    edge="signal"
    :state="specialArmor ? 'yellow' : 'empty'"
  >
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
  </UiSheetCard>
</template>

<style scoped>
.resistance-card {
  container-type: inline-size;
}

.resistance-card[data-state='yellow'] {
  --diamond-selected: var(--color-on-accent);
  --diamond-selected-decoration: underline;
}

.example {
  font-size: var(--font-sheet-rule-size);
  line-height: 1.35;
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
  --diamond-label-size: var(--font-small-control-size);
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
