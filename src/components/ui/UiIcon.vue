<script setup lang="ts">
defineProps<{ name: 'reroll' | 'portrait' | 'arrow-right' | 'document' | 'close' }>()
</script>
<template>
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path v-if="name === 'reroll'" d="M17.66 17.66a8 8 0 1 1 0-11.32L20 8.68M20 4v4.68h-4.68" />
    <path v-else-if="name === 'close'" d="m6 6 12 12M6 18 18 6" />
    <path v-else-if="name === 'arrow-right'" d="M5 12h14m-6-6 6 6-6 6" />
    <template v-else-if="name === 'document'">
      <path d="M14 3H5v18h14V8Z M14 3v5h5 M8 12h8 M8 16h8" />
    </template>
    <template v-else>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </template>
  </svg>
</template>
