<script setup lang="ts">
import UiChoicePicker from './UiChoicePicker.vue'
defineProps<{
  modelValue: string
  options: readonly { id: string; label: string; group: string }[]
}>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
<template>
  <UiChoicePicker :model-value="modelValue" :options="options" @update:model-value="$emit('update:modelValue', $event)" />
</template>
