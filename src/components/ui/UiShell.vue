<script setup lang="ts">
import type { Theme } from '@/styles/themes'
import { useRoute } from 'vue-router'
defineProps<{ theme: Theme }>()
const route = useRoute()
</script>
<template>
  <a class="skip" href="#main">{{ route.path === '/about' ? 'Skip to content' : 'Skip to generator' }}</a>
  <div class="shell" :data-theme="theme">
    <header>
      <nav aria-label="Main navigation">
        <RouterLink v-if="route.path === '/about'" :to="{ path: '/', query: route.query }">Back to generator</RouterLink>
        <RouterLink v-else :to="{ path: '/about', query: route.query }">About</RouterLink>
      </nav>
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
  border-bottom: var(--theme-header-rule-width) solid var(--color-on-page);
  position: relative;
}
nav {
  flex-basis: 100%;
  display: flex;
  justify-content: flex-end;
}
nav a {
  display: inline-flex;
  align-items: center;
  min-height: var(--control-height);
  padding-inline: var(--space-2);
  color: inherit;
  font-weight: 600;
  text-underline-offset: 0.2em;
}
header::after {
  content: '';
  position: absolute;
  bottom: calc(-1 * var(--theme-header-rule-width));
  right: 0;
  width: 30%;
  height: var(--theme-header-rule-width);
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
  font-weight: var(--theme-heading-weight);
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
