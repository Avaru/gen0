<template>
  <article><slot /></article>
</template>
<style scoped>
article {
  display: grid;
  gap: var(--space-6);
  max-width: 42rem;
  color: var(--color-on-page);
  overflow-wrap: anywhere;
}
</style>
