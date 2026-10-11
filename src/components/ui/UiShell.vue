<script setup lang="ts">
import type { Theme } from '@/styles/themes'
import { useRoute } from 'vue-router'
import { computed, nextTick, useTemplateRef, watch } from 'vue'
import { settingsFromRoute, settingsPath, settingsQuery } from '@/generator/settings'
import UiScrambleText from '@/components/ui/UiScrambleText.vue'
defineProps<{ theme: Theme }>()
const version = __APP_VERSION__
const route = useRoute()
const main = useTemplateRef<HTMLElement>('main')
const isAbout = computed(() => route.matched.some((record) => record.path.endsWith('/about')))
// Announce the new page without taking focus from controls on settings changes.
watch(() => route.matched, async (matched, previous) => {
  if (!previous.length
    || matched.some((record) => record.path.endsWith('/about'))
      === previous.some((record) => record.path.endsWith('/about'))) return
  await nextTick()
  main.value?.focus()
})
const navigation = computed(() => {
  const settings = settingsFromRoute(route)
  return {
    path: settingsPath(settings) + (isAbout.value ? '' : '/about'),
    query: settingsQuery(settings),
  }
})
</script>
<template>
  <a class="skip" href="#main">{{ isAbout ? 'Skip to content' : 'Skip to generator' }}</a>
  <div class="shell" :data-theme="theme">
    <header>
      <nav aria-label="Main navigation">
        <RouterLink :to="navigation"><span class="link-label">{{ isAbout ? 'Back to generator' : 'About' }}</span></RouterLink>
      </nav>
      <span class="brand">gen 0</span><span class="caption">Cyberpunk name generator</span>
      <a
        class="version"
        href="https://github.com/Avaru/gen0"
        target="_blank"
        rel="noopener noreferrer"
        title="View gen0 on GitHub (opens in a new tab)"
      ><UiScrambleText class="link-label" :text="`#${version}`" /></a>
    </header>
    <main id="main" ref="main" tabindex="-1"><slot /></main>
  </div>
</template>
<style scoped>
.shell {
  max-width: 74rem;
  margin-inline: auto;
  padding: var(--space-6) var(--space-4) var(--space-8);
}
.shell :deep(a) {
  color: inherit;
  text-decoration: none;
}
.shell :deep(.link-label) {
  display: inline-block;
  padding: 0 1px;
  border-bottom: 1px solid currentColor;
  background-image: linear-gradient(var(--color-link-background), var(--color-link-background));
  background-repeat: no-repeat;
  background-size: 0% 100%;
  transition: var(--link-transition);
}
.shell :deep(a:hover .link-label),
.shell :deep(a:focus-visible .link-label) {
  color: var(--color-accent);
  background-size: 100% 100%;
  border-bottom-color: var(--color-signal);
}
.shell :deep(a.version .link-label) {
  border-bottom: 0;
}
.shell :deep(a:focus-visible) {
  outline-color: var(--color-on-page);
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
  padding-right: calc(3rem + var(--space-3));
}
nav a {
  display: inline-flex;
  align-items: center;
  min-height: var(--control-height);
  padding-inline: 1px;
  font-weight: 600;
}
main:focus {
  outline: none;
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
  top: calc((var(--control-height) - 0.625rem) / 2);
  right: 0;
  width: 3rem;
  height: 0.625rem;
  background: var(--theme-panel-edge);
  pointer-events: none;
}
.version {
  position: absolute;
  bottom: var(--space-2);
  right: 0;
  font-size: 0.625rem;
  line-height: 1;
  white-space: nowrap;
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
