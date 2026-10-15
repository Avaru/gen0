<script setup lang="ts">
import { ref } from 'vue'
import { usePreferencesStore } from '@/stores/preferences'
import UiToggle from '@/components/ui/UiToggle.vue'
import UiArticle from '@/components/ui/UiArticle.vue'
import UiScrambleText from '@/components/ui/UiScrambleText.vue'

const preferences = usePreferencesStore()
const corpModeSwitch = ref(preferences.soullessCorpMode)
let corpModeToggles: number[] = []

function toggleCorpMode(enabled: boolean) {
  corpModeSwitch.value = enabled
  const now = performance.now()
  corpModeToggles = corpModeToggles.filter((time) => now - time <= 5000)
  corpModeToggles.push(now)

  if (preferences.soullessCorpMode) {
    preferences.soullessCorpMode = false
    corpModeToggles = []
  } else if (enabled && corpModeToggles.length >= 3) {
    preferences.soullessCorpMode = true
    corpModeToggles = []
  }
}

const dataUseNotice = 'I do not allow any of the data in this project to be used for training '
  + 'or developing AI models without my explicit permission.'
const paragraphs = [
  'Created by Anton Katzer, gen 0 continues the name generators from RPGenerator and itemcards.com. '
    + 'All fragments used to build the lists are hand-crafted, sourced from census data, or inspired '
    + 'by cyberpunk universes, providing names and ideas for your tabletop roleplaying sessions.',
  'This version focuses on cyberpunk, with Generic, Shadowrun and Cyberpunk 2020/2077 flavors. '
    + 'Alongside personal names, you’ll find runner handles, corporations, weapons, entertainment '
    + 'and things to discover on hacked devices. The name lists have grown over the years from '
    + 'census data, freely available name lists and ideas developed at the gaming table.',
  'The generator is always in development. Imagine a 90s “under construction” GIF here and '
    + 'pretend it fits the retro cyberpunk aesthetic.',
]
</script>
<template>
  <div class="about-page">
    <UiToggle
      :model-value="corpModeSwitch"
      @update:model-value="toggleCorpMode"
      class="corp-mode"
      label="soulless corp mode"
    />
    <UiArticle>
      <h1><UiScrambleText text="About gen 0" /></h1>
      <p v-for="paragraph in paragraphs" :key="paragraph">
        <UiScrambleText :text="paragraph" />
      </p>
      <p>
        <UiScrambleText text="Everything here is available on" />
        {{ ' ' }}<a
          href="https://github.com/Avaru/gen0"
          target="_blank"
          rel="noopener noreferrer"
          title="View gen0 on GitHub (opens in a new tab)"
        ><UiScrambleText class="link-label" text="GitHub" /></a>.
      </p>
      <p><UiScrambleText :text="dataUseNotice" /></p>
    </UiArticle>
  </div>
</template>
<style scoped>
.about-page {
  position: relative;
}
.corp-mode {
  position: absolute;
  top: calc(var(--space-2) - var(--space-6));
  right: 0;
  min-height: 1rem;
  flex-direction: row;
  gap: var(--space-2);
  font-size: 0.625rem;
  font-weight: 400;
  color: var(--color-on-page);
  opacity: 0.3;
}
.corp-mode:hover,
.corp-mode:focus-within {
  opacity: 1;
}
.corp-mode :deep(.track) {
  width: 1.625rem;
  height: 1rem;
  border-color: currentColor;
  background: var(--color-page);
}
.corp-mode :deep(.track::after) {
  width: 0.5rem;
  height: 0.5rem;
  background: currentColor;
}
.corp-mode :deep(input:checked + .track) {
  background: var(--color-on-page);
  border-color: var(--color-on-page);
}
.corp-mode :deep(input:checked + .track::after) {
  background: var(--color-page);
}
.corp-mode:hover {
  color: var(--color-on-page);
}
.corp-mode:hover :deep(input + .track) {
  border-color: var(--color-on-page);
}
.corp-mode:hover :deep(input:not(:checked) + .track) {
  background: var(--color-page);
}
.corp-mode:hover :deep(input:checked + .track) {
  background: var(--color-on-page);
}
@media (prefers-reduced-motion: no-preference) {
  .corp-mode {
    transition: opacity 200ms ease;
  }
}
@media (forced-colors: active) {
  .corp-mode {
    opacity: 1;
  }
}
</style>
