<script setup lang="ts">
import type { Theme } from '@/styles/themes'
import { useRoute, type NavigationFailure } from 'vue-router'
import { computed, nextTick, provide, ref, useTemplateRef, watch } from 'vue'
import { settingsFromRoute, settingsPath, settingsQuery } from '@/generator/settings'
import UiScrambleText from '@/components/ui/UiScrambleText.vue'
import UiBrandTitle from '@/components/ui/UiBrandTitle.vue'
import UiButton from './UiButton.vue'
defineProps<{ theme: Theme }>()
const showCharacterGuide = ref(false)
provide('showCharacterGuide', showCharacterGuide)
const version = __APP_VERSION__
const route = useRoute()
const main = useTemplateRef<HTMLElement>('main')
const isAbout = computed(() => route.matched.some((record) => record.path.endsWith('/about')))
const isCharacter = computed(() => route.matched.some((record) => record.path === '/chars/cbrpnk'))
const page = computed(() => isAbout.value ? 'about' : isCharacter.value ? 'char' : 'generator')
// Announce the new page without taking focus from controls on settings changes.
watch(() => route.matched, async (matched, previous) => {
  const pageKind = (records: typeof matched) => records.some(record => record.path.endsWith('/about'))
    ? 'about' : records.some(record => record.path === '/chars/cbrpnk') ? 'char' : 'generator'
  if (!previous.length || pageKind(matched) === pageKind(previous)) return
  await nextTick()
  main.value?.focus({ preventScroll: true })
})
async function navigateFromMenu(
  event: MouseEvent,
  navigate: (event?: MouseEvent) => Promise<void | NavigationFailure>,
) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
  await navigate(event)
  await nextTick()
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
}
const navigation = computed(() => {
  const settings = settingsFromRoute(route)
  return {
    path: settingsPath(settings) + (page.value === 'generator' ? '/about' : ''),
    query: settingsQuery(settings),
  }
})
const aboutNavigation = computed(() => ({
  path: `${settingsPath(settingsFromRoute(route))}/about`,
  query: settingsQuery(settingsFromRoute(route)),
}))
</script>
<template>
  <a class="skip" href="#main">{{ page === 'generator' ? 'Skip to generator' : 'Skip to content' }}</a>
  <div class="shell" :data-theme="theme">
    <header>
      <nav aria-label="Main navigation">
        <RouterLink v-slot="{ href, navigate }" :to="navigation" custom>
          <a :href="href" @click="navigateFromMenu($event, navigate)"><span class="link-label">{{ page === 'generator' ? 'About' : 'Name generator' }}</span></a>
        </RouterLink>
        <RouterLink v-if="isCharacter" v-slot="{ href, navigate }" :to="aboutNavigation" custom>
          <a :href="href" @click="navigateFromMenu($event, navigate)"><span class="link-label">About</span></a>
        </RouterLink>
        <RouterLink v-slot="{ href, navigate }" to="/chars/cbrpnk" custom>
          <a :href="href" :aria-current="isCharacter ? 'page' : undefined" @click="navigateFromMenu($event, navigate)"><span class="link-label">CBR+PNK</span></a>
        </RouterLink>
      </nav>
      <UiBrandTitle />
      <h1 v-if="isCharacter" class="caption">CBR+PNK <span class="caption-line">Runner sheet</span></h1>
      <span v-else class="caption">Cyberpunk name generator</span>
      <div v-if="isCharacter" class="character-actions">
        <UiButton
          :aria-expanded="showCharacterGuide"
          aria-controls="runner-guide"
          @click="showCharacterGuide = !showCharacterGuide"
        >guide</UiButton>
      </div>
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
  flex-wrap: wrap;
  gap: var(--space-3);
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
.character-actions {
  --button-flex: 0 0 auto;
  --button-font-size: var(--font-control-size);
  --button-padding-inline: var(--space-2);
  --button-white-space: nowrap;
  position: absolute;
  bottom: calc(var(--space-2) + 0.625rem + var(--space-2));
  right: 0;
  display: flex;
  gap: var(--space-2);
}
@media (max-width: 47.999rem) {
  h1.caption {
    flex-basis: 100%;
    max-width: calc(100% - 11rem);
    margin-right: 11rem;
  }
}
.version {
  position: absolute;
  bottom: var(--space-2);
  right: 0;
  font-size: 0.625rem;
  line-height: 1;
  white-space: nowrap;
}
.caption {
  font-family: var(--font-body);
  line-height: 1.5;
  max-width: 15rem;
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.caption-line { display: block; }
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
