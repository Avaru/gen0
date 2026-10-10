import { rng } from './rng'

export const replacePlaceholder = (str: string, replacements: string[]): string => {
  let result = str
  replacements.sort(() => rng() - 0.5)
  let occurences = str.split('$').length - 1
  for (occurences; occurences > 0; occurences--) {
    for (const replacement of replacements) {
      result = result.replace(/\$/, replacement)
    }
  }
  return result
}
