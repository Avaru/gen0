<script setup lang="ts">
defineProps<{
  modelValue: string
  label: string
  name: string
  options: readonly { value: string; label: string }[]
}>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>
<template>
  <fieldset>
    <legend>{{ label }}</legend>
    <div class="segments">
      <label v-for="option in options" :key="option.value">
        <input
          type="radio"
          :name="name"
          :value="option.value"
          :checked="modelValue === option.value"
          @change="$emit('update:modelValue', option.value)"
        />
        <span>{{ option.label }}</span>
      </label>
    </div>
  </fieldset>
</template>
<style scoped>
fieldset {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}
legend {
  padding: 0;
  margin-bottom: var(--space-2);
  font-weight: 650;
}
.segments {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
  padding: var(--space-1);
  border: 1px solid var(--color-control-border);
  background: var(--color-subtle);
  border-radius: var(--radius-sm);
}
label {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  cursor: pointer;
}
input {
  position: absolute;
  width: 1px;
  height: 1px;
  min-height: 0;
  opacity: 0;
}
span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: var(--control-height);
  padding: var(--space-2) var(--space-3);
  border-radius: calc(var(--radius-sm) - var(--space-1));
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
}
input:checked + span {
  background: var(--color-accent);
  color: var(--color-on-accent);
}
input:focus-visible + span {
  outline: 3px solid var(--color-focus);
  outline-offset: 2px;
}
</style>
