/** Themes define appearance independently of content flavors. */
export const themes = ['cyberpunk', 'never-midnight'] as const
export type Theme = (typeof themes)[number]
