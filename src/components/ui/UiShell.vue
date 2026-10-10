<script setup lang="ts">
import type { Theme } from '@/styles/themes'
defineProps<{ theme: Theme }>()
</script>
<template>
  <a class="skip" href="#main">Skip to generator</a>
  <div class="shell" :data-theme="theme">
    <header>
      <span class="brand">gen 0</span
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
  color: var(--color-on-page);
  padding-bottom: var(--space-6);
  margin-bottom: var(--space-6);
  border-bottom: 8px solid var(--color-on-page);
  position: relative;
}
header::after {
  content: '';
  position: absolute;
  bottom: -8px;
  right: 0;
  width: 30%;
  height: 8px;
  background: var(--theme-rule);
  background-color: var(--color-page);
}
header::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 3rem;
  height: 0.625rem;
  background: var(--theme-panel-edge);
  pointer-events: none;
}
.brand {
  font-size: clamp(5rem, 16vw, 9rem);
  font-family: var(--font-display);
  font-weight: 800;
  line-height: 0.85;
  text-transform: uppercase;
  transform: skew(var(--theme-heading-slant));
  letter-spacing: -0.06em;
  text-shadow: var(--theme-brand-shadow);
}
.caption {
  max-width: 15rem;
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
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
