<script setup lang="ts">
import UiSheetSymbol from './UiSheetSymbol.vue'
import UiSheetCard from './UiSheetCard.vue'
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
          Body modifications of all types—Cybernetics, Biotech and others—are widely adopted among
          Runners. Define your starting <strong>Signature Augmentation</strong> by writing down its
          model/brand and an outline of its primary feature,
          <em>e.g. Ashide™ Racing Legs.</em>
        </p>
        <p>
          While taking action or resisting Consequences, you can mark
          <UiSheetSymbol kind="stress" label="stress" /> or <strong>SPECIAL RESISTANCE</strong> to
          leverage your Augmentation into it.
        </p>
        <p>
          <em
            >During the Run, you may declare additional Augmentations or extra functionalities of
            existing ones as <strong>UPGRADES</strong> (panel 8).</em
          >
        </p>
      </li>
      <li>
        Don’t pick your <strong>Gear</strong> just yet—you’ll decide what you are carrying on the
        fly during the Run. For now, just circle on the list the ones you are interested in, for
        easy referencing later.
      </li>
    </ol>
  </UiSheetCard>
</template>

<style scoped>
.file-runner {
  grid-column: 1 / -1;
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

@media print {
  .file-runner {
    display: none !important;
  }
}
</style>
