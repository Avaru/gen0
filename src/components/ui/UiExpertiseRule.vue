<template>
  <p class="expertise-rule">
    Expertises don’t add + to a roll, but allow you to trade + for an EDGE—and vice versa—when they
    are applicable.
  </p>
</template>
<style scoped>
.expertise-rule {
  flex: 1 1 10rem;
  max-width: 19rem;
  margin-left: auto;
  text-align: right;
  color: var(--color-muted);
  font-size: var(--font-sheet-rule-size);
  line-height: 1.35;
}
@media screen {
  .expertise-rule {
    text-box-trim: trim-start;
    text-box-edge: cap alphabetic;
  }
}
</style>
