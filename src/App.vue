<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { useRoute } from 'vue-router'
import { settingsFromRoute } from '@/generator/settings'
import { flavorThemes } from '@/styles/themes'
import UiShell from '@/components/ui/UiShell.vue'

const route = useRoute()
provide('showDetails', ref(true))
const theme = computed(() => flavorThemes[settingsFromRoute(route).flavor])
</script>
<template>
  <UiShell :theme="theme"><RouterView /></UiShell>
</template>
