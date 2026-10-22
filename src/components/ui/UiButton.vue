<script setup lang="ts">
import { Comment, Fragment, Text, inject, ref, useSlots, type VNode } from 'vue'
import { themeKey } from '@/styles/themes'
import UiSymbolText from './UiSymbolText.vue'

const theme = inject(themeKey, ref('cyberpunk'))
const interaction = ref(0)
const slots = useSlots()
const props = withDefaults(
  defineProps<{
    type?: 'button' | 'submit'
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
      { 'on-background': onBackground, 'icon-feedback': feedback === 'icon' },
      activation ? (activation % 2 ? 'pulse-a' : 'pulse-b') : undefined,
    ]"
  >
    <span class="button-text"
      ><UiSymbolText
        v-if="symbolText()"
        :text="symbolText()"
        :replay-key="`${interaction}-${activation}`" /><slot v-else
    /></span>
  </button>
</template>
<style scoped>
button {
  transition: var(--control-color-transition);
  position: relative;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--button-padding-inline, var(--space-6));
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
.icon-feedback:where([data-theme='cyberpunk'] *).pulse-a {
  animation: icon-pulse-a 550ms steps(1, end);
}
.icon-feedback:where([data-theme='cyberpunk'] *).pulse-b {
  animation: icon-pulse-b 550ms steps(1, end);
}
.icon-feedback:where([data-theme='cyberpunk'] *):active:enabled {
  animation: icon-pulse-a 550ms steps(1, end);
}
@keyframes icon-pulse-a {
  0%,
  100% {
    color: var(--button-icon-rest-color, var(--color-signal));
    transform: none;
    filter: none;
    clip-path: none;
  }
  12% {
    color: var(--color-accent);
    transform: translate(-5px, 1px) skewX(-18deg) scale(1.25, 0.8);
    filter: drop-shadow(3px 0 var(--color-hot));
  }
  28% {
    color: var(--color-signal);
    transform: translate(6px, -2px) skewX(22deg);
    clip-path: inset(35% 0 28% 0);
    filter: drop-shadow(-3px 0 var(--color-hot));
  }
  44% {
    color: var(--color-accent);
    transform: translate(-3px, 2px) scale(0.85, 1.3);
    filter: drop-shadow(3px 0 var(--color-signal));
  }
  62% {
    transform: translate(2px, -1px) skewX(-12deg);
    clip-path: inset(0 0 40% 0);
    filter: drop-shadow(-2px 0 var(--color-hot));
  }
  80% {
    color: var(--color-accent);
    transform: translate(-1px, 0);
    filter: none;
    clip-path: none;
  }
}
@keyframes icon-pulse-b {
  0%,
  100% {
    color: var(--button-icon-rest-color, var(--color-signal));
    transform: none;
    filter: none;
    clip-path: none;
  }
  12% {
    color: var(--color-accent);
    transform: translate(-5px, 1px) skewX(-18deg) scale(1.25, 0.8);
    filter: drop-shadow(3px 0 var(--color-hot));
  }
  28% {
    color: var(--color-signal);
    transform: translate(6px, -2px) skewX(22deg);
    clip-path: inset(35% 0 28% 0);
    filter: drop-shadow(-3px 0 var(--color-hot));
  }
  44% {
    color: var(--color-accent);
    transform: translate(-3px, 2px) scale(0.85, 1.3);
    filter: drop-shadow(3px 0 var(--color-signal));
  }
  62% {
    transform: translate(2px, -1px) skewX(-12deg);
    clip-path: inset(0 0 40% 0);
    filter: drop-shadow(-2px 0 var(--color-hot));
  }
  80% {
    color: var(--color-accent);
    transform: translate(-1px, 0);
    filter: none;
    clip-path: none;
  }
}
@keyframes icon-hover-glitch {
  0%,
  100% {
    transform: none;
    filter: none;
  }
  20% {
    transform: translate(-1px, 0) skewX(-6deg);
    filter: drop-shadow(1px 0 var(--color-hot));
  }
  45% {
    transform: translate(2px, -1px) skewX(8deg);
    filter: drop-shadow(-1px 0 var(--color-signal));
  }
  70% {
    transform: translate(-1px, 1px);
    filter: none;
  }
}
@media screen and (hover: hover) and (prefers-reduced-motion: no-preference) {
  .icon-feedback:where([data-theme='cyberpunk'] *):hover:enabled .button-text {
    animation: icon-hover-glitch 240ms steps(1, end);
  }
}
@media screen {
  .primary:where([data-theme='cyberpunk'] *) {
    overflow: hidden;
  }
}
@media screen and (prefers-reduced-motion: no-preference) {
  .icon-feedback:where([data-theme='cyberpunk'] *):active:enabled .button-text {
    animation: icon-hover-glitch 240ms steps(1, end);
  }
  .primary:where([data-theme='cyberpunk'] *):active:enabled .button-text {
    transform: translateX(3px) scale(1.15, 0.9);
    animation: hover-text-glitch 240ms steps(1, end);
  }
  .primary:where([data-theme='cyberpunk'] *):active:enabled::before {
    animation: hover-noise-glitch 240ms steps(1, end);
  }
  .primary:where([data-theme='cyberpunk'] *) .button-text {
    position: relative;
    z-index: 1;
    transition: transform 60ms ease-out;
  }
  .primary:where([data-theme='cyberpunk'] *)::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    opacity: 0;
    background:
      repeating-linear-gradient(0deg, currentColor 0 1px, transparent 1px 3px),
      repeating-linear-gradient(
        113deg,
        transparent 0 5px,
        currentColor 5px 7px,
        transparent 7px 11px
      );
    background-size:
      100% 7px,
      17px 13px;
  }
  @media (hover: hover) {
    .primary:where([data-theme='cyberpunk'] *):hover:enabled .button-text {
      transform: translateX(3px) scale(1.15, 0.9);
      animation: hover-text-glitch 240ms steps(1, end);
    }
    .primary:where([data-theme='cyberpunk'] *):hover:enabled::before {
      animation: hover-noise-glitch 240ms steps(1, end);
    }
  }
}
@keyframes hover-text-glitch {
  0% {
    transform: translate(-12%, 2px) scale(1.6, 0.6) skewX(-18deg);
  }
  18% {
    transform: translate(65%, -4px) scale(2.2, 1.25) skewX(24deg);
  }
  36% {
    transform: translate(-80%, 3px) scale(0.8, 1.6) skewX(-30deg);
  }
  54% {
    transform: translate(20%, -2px) scale(1.9, 0.5);
  }
  72% {
    transform: translate(-8%, 1px) scale(1.35, 1.3) skewX(12deg);
  }
  100% {
    transform: translateX(3px) scale(1.15, 0.9);
  }
}
@keyframes hover-noise-glitch {
  0%,
  36%,
  72% {
    opacity: 0.38;
    background-position:
      7px -3px,
      -11px 5px;
  }
  18%,
  54% {
    opacity: 0.08;
    background-position:
      -5px 4px,
      8px -7px;
  }
  100% {
    opacity: 0;
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
button:where([data-theme='never-midnight'] *) {
  border: 2px solid var(--color-text);
  border-bottom-width: 4px;
}
</style>
