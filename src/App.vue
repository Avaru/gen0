<script setup lang="ts">
import { computed, provide, ref } from 'vue'
import { useRoute } from 'vue-router'
import { settingsFromRoute } from '@/generator/settings'
import { getSetting } from '@/generator/settingRegistry'
import UiShell from '@/components/ui/UiShell.vue'
import MothershipCharacterActions from '@/views/MothershipCharacterActions.vue'

const route = useRoute()
provide('showDetails', ref(true))
const theme = computed(() => getSetting(settingsFromRoute(route).setting).theme)
</script>
<template>
  <UiShell :theme="theme">
    <template #character-actions>
      <MothershipCharacterActions
        v-if="route.meta.setting === 'mothership' && route.meta.characterSheet"
      />
    </template>
    <RouterView />
  </UiShell>
</template>
