<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { normalizeGeneratorSettings } from '@/generator/settings'
import { flavorThemes } from '@/styles/themes'
import UiShell from '@/components/ui/UiShell.vue'

const route = useRoute()
const theme = computed(() => flavorThemes[normalizeGeneratorSettings(route.query).flavor])
</script>
<template>
  <UiShell :theme="theme"><RouterView /></UiShell>
</template>
