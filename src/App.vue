<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { useRoute } from 'vue-router'
import { settingsFromRoute } from '@/generator/settings'
import { getSetting } from '@/generator/settingRegistry'
import UiShell from '@/components/ui/UiShell.vue'

const route = useRoute()
provide('showDetails', ref(true))
const theme = computed(() => getSetting(settingsFromRoute(route).setting).theme)
</script>
<template>
  <UiShell :theme="theme"><RouterView /></UiShell>
</template>
