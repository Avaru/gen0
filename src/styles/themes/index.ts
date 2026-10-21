/** Themes define appearance independently of content flavors. */
export const themes = ['cyberpunk'] as const
export type Theme = (typeof themes)[number]
