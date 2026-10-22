<script setup lang="ts">
defineProps<{ name: 'reroll' | 'portrait' }>()
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
    <path v-if="name === 'reroll'" d="M20 7v5h-5M20 12a8 8 0 1 0-2.3 5.7" />
    <template v-else>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </template>
  </svg>
</template>
