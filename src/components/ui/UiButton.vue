<script setup lang="ts">
import { Comment, Fragment, Text, inject, ref, useSlots, type VNode } from 'vue'
import { themeKey } from '@/styles/themes'
import UiSymbolText from './UiSymbolText.vue'
import UiIcon from './UiIcon.vue'

const theme = inject(themeKey, ref('cyberpunk'))
const interaction = ref(0)
const slots = useSlots()
const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit'
    appearance?: 'button' | 'icon'
    icon?: 'reroll' | 'portrait'
    variant?: 'primary' | 'secondary' | 'destructive' | 'destructive-secondary'
    onBackground?: boolean
    activation?: number
    feedback?: 'fill' | 'icon'
    garble?: boolean
    disabled?: boolean
  }>(),
  {
    type: 'button',
    variant: 'primary',
    activation: 0,
    feedback: 'fill',
    garble: undefined,
  },
)
function plainText(nodes: VNode[]): string | undefined {
  let text = ''
  for (const node of nodes) {
    if (node.type === Comment) continue
    if (node.type === Text && typeof node.children === 'string') text += node.children
    else if (node.type === Fragment && Array.isArray(node.children)) {
      const part = plainText(node.children as VNode[])
      if (part === undefined) return undefined
      text += part
    } else return undefined
  }
  return text
}
function symbolText() {
  if (props.disabled || !(props.garble ?? theme.value === 'never-midnight')) return ''
  return plainText(slots.default?.() ?? [])?.trim() ?? ''
}
function interact() {
  if (!props.disabled) interaction.value++
}
</script>
<template>
  <button
    @mouseenter="interact"
    @pointerdown="interact"
    @focus="interact"
    :disabled="disabled"
    :type="type"
    :class="[
      variant,
      { 'appearance-icon': appearance === 'icon' },
      { 'on-background': onBackground, 'icon-feedback': feedback === 'icon' },
      activation ? (activation % 2 ? 'pulse-a' : 'pulse-b') : undefined,
    ]"
  >
    <span class="button-text"
      ><UiSymbolText
        v-if="symbolText()"
        :text="symbolText()"
        :replay-key="`${interaction}-${activation}`" /><UiIcon v-else-if="icon" :name="icon" /><slot
        v-else
    /></span>
  </button>
</template>
<style scoped>
button {
  transition: var(--control-color-transition);
  position: relative;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: var(--button-padding-block, var(--space-2)) var(--button-padding-inline, var(--space-6));
  min-height: var(--button-min-height, auto);
  margin-top: var(--button-margin-top, 0);
  line-height: var(--button-line-height, normal);
  font-family: var(--font-display);
  font-size: var(--button-font-size, 1.375rem);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 700;
  border-bottom: 4px solid var(--color-on-accent);
  overflow-wrap: anywhere;
  white-space: var(--button-white-space, normal);
  flex: var(--button-flex, 0 1 auto);
}
.button-text {
  display: inline-block;
  pointer-events: none;
}
button::after {
  transition: var(--control-color-transition);
  content: '';
  position: absolute;
  right: 3px;
  bottom: 3px;
  width: 0.625rem;
  height: 0.625rem;
  background: var(--theme-button-detail);
  opacity: 0.65;
  pointer-events: none;
}
.primary {
  --button-feedback-color: var(--color-signal);
  --button-rest-color: var(--color-accent);
  background: var(--color-accent);
  color: var(--color-on-accent);
}
.primary:hover:enabled {
  --button-rest-color: var(--color-primary-hover, #fff);
  background: var(--color-primary-hover, #fff);
  color: var(--color-on-accent);
}
.primary:active:enabled {
  background: color-mix(in srgb, var(--color-accent-hover) 85%, var(--color-on-accent));
}
.on-background {
  --control-focus-color: var(--color-on-page);
}
.primary.on-background {
  --button-rest-color: var(--color-on-page);
  background: var(--color-on-page);
  color: var(--color-page);
  border-bottom-color: color-mix(in srgb, var(--color-on-page) 65%, var(--color-page));
}
.primary.on-background:hover:enabled {
  --button-rest-color: var(--color-primary-hover, #fff);
  background: var(--button-rest-color);
  color: var(--color-on-accent);
}
.primary.on-background:active:enabled {
  background: color-mix(in srgb, var(--color-on-page) 75%, var(--color-page));
}
.secondary {
  border-color: var(--color-signal);
  background: var(--color-surface);
  color: var(--color-signal);
}
.secondary:hover:enabled {
  background: var(--color-subtle);
}
.secondary:active:enabled {
  background: color-mix(in srgb, var(--color-signal) 16%, var(--color-surface));
}
.destructive {
  --button-feedback-color: var(--color-signal);
  --button-rest-color: var(--color-destructive, var(--color-hot));
  background: var(--color-destructive, var(--color-hot));
  color: var(--color-on-destructive, var(--color-on-accent));
}
.destructive:hover:enabled {
  --button-rest-color: color-mix(in srgb, var(--color-destructive, var(--color-hot)) 85%, white);
  background: var(--button-rest-color);
}
.destructive:active:enabled {
  background: color-mix(
    in srgb,
    var(--color-destructive, var(--color-hot)) 85%,
    var(--color-on-destructive, var(--color-on-accent))
  );
}
.destructive-secondary {
  border-color: var(--color-destructive, var(--color-hot));
  background: var(--color-surface);
  color: var(--color-destructive, var(--color-hot));
}
.destructive-secondary:hover:enabled {
  background: var(--color-subtle);
}
.destructive-secondary:active:enabled {
  background: color-mix(
    in srgb,
    var(--color-destructive, var(--color-hot)) 16%,
    var(--color-surface)
  );
}
.pulse-a,
.pulse-b {
  animation-duration: 500ms;
  animation-timing-function: ease-out;
}
.pulse-a {
  animation-name: button-pulse-a;
}
.pulse-b {
  animation-name: button-pulse-b;
}
@keyframes button-pulse-a {
  0%,
  100% {
    background-color: var(--button-rest-color);
  }
  35% {
    background-color: var(--button-feedback-color);
  }
}
@keyframes button-pulse-b {
  0%,
  100% {
    background-color: var(--button-rest-color);
  }
  35% {
    background-color: var(--button-feedback-color);
  }
}
/* Icon actions share their shape; parents only position them. */
button.appearance-icon {
  display: grid;
  place-items: center;
  justify-items: var(--button-icon-align, center);
  width: var(--button-icon-size, var(--control-height));
  height: var(--control-height);
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--button-icon-rest-color, inherit);
}
.appearance-icon .button-text {
  display: grid;
  place-items: center;
}
.appearance-icon::before,
.appearance-icon::after {
  display: none;
}
button.appearance-icon:hover:enabled,
button.appearance-icon:active:enabled {
  background: transparent;
  color: var(--color-accent);
}
@media print {
  .appearance-icon {
    display: none !important;
  }
}
@keyframes icon-copy-highlight {
  0%,
  100% {
    color: var(--button-icon-rest-color, var(--color-signal));
  }
  30% {
    color: var(--color-accent);
  }
}
@media (prefers-reduced-motion: reduce) {
  .icon-feedback.pulse-a,
  .icon-feedback.pulse-b,
  .icon-feedback:active:enabled {
    animation: icon-copy-highlight 550ms ease-out;
  }
  .pulse-a,
  .pulse-b {
    animation: none;
  }
}
</style>

<style scoped src="../../styles/themes/cyberpunk-button.css"></style>
<style scoped src="../../styles/themes/never-midnight-button.css"></style>
