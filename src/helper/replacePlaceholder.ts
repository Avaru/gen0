import { rng } from './rng'

export const replacePlaceholder = (str: string, replacements: readonly string[]): string => {
  if (!str.includes('$')) return str
  if (!replacements.length) throw new Error('No replacements match this placeholder.')
  const choices = [...replacements]
  // Shuffle an independent copy, preserving duplicate weights.
  for (let index = choices.length - 1; index > 0; index--) {
    const other = Math.floor(rng() * (index + 1))
    ;[choices[index], choices[other]] = [choices[other]!, choices[index]!]
  }
  let index = 0
  return str.replace(/\$/g, () => choices[index++ % choices.length]!)
}
