<script setup lang="ts">
import UiArticle from '@/components/ui/UiArticle.vue'
import UiScrambleText from '@/components/ui/UiScrambleText.vue'

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
</template>
