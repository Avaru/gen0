import type { InjectionKey, Ref } from 'vue'

/** Themes define appearance independently of content flavors. */
export const themes = ['cyberpunk', 'never-midnight', 'mothership'] as const
export type Theme = (typeof themes)[number]
export const themeKey: InjectionKey<Readonly<Ref<Theme>>> = Symbol('theme')
