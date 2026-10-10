<template>
  <a class="skip" href="#main">Skip to generator</a>
  <div class="shell">
    <header>
      <span class="brand">gen0<span class="dot">.</span></span
      ><span class="caption">Cyberpunk name generator</span>
    </header>
    <main id="main" tabindex="-1"><slot /></main>
  </div>
</template>
<style scoped>
.shell {
  max-width: 74rem;
  margin-inline: auto;
  padding: var(--space-6) var(--space-4) var(--space-8);
}
header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: var(--space-3);
  padding-bottom: var(--space-8);
}
.brand {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.06em;
}
.dot {
  color: var(--color-accent);
}
.caption {
  font-size: 0.875rem;
  color: var(--color-muted);
}
.skip {
  position: fixed;
  top: var(--space-2);
  left: var(--space-2);
  z-index: 10;
  transform: translateY(-200%);
  padding: var(--space-3);
  background: var(--color-surface);
  color: var(--color-accent);
}
.skip:focus {
  transform: none;
}
@media (min-width: 48rem) {
  .shell {
    padding: var(--space-8);
  }
}
</style>
