<template>
  <div class="workspace"><slot /></div>
</template>
<style scoped>
.workspace {
  display: grid;
  align-items: start;
  gap: var(--space-6);
}
.workspace > :deep(*) {
  min-width: 0;
}
@media (min-width: 56rem) {
  .workspace {
    grid-template-columns: 23rem minmax(0, 1fr);
    gap: var(--space-8);
  }
}
</style>
