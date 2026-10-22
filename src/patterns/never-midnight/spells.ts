import {
  spellConcepts,
  spellExpressions,
  spellShapes,
  spellSources,
  spellTypes,
} from '@/data/never-midnight-spells'
import { randomFrom } from '@/helper/randomFrom'
import { rng } from '@/helper/rng'
import type { Generated } from '@/patterns/types'

// Each one-concept shape gets two chances; each two-concept shape gets one.
const shapePool = spellShapes.flatMap((shape) =>
  shape.match(/\(concept\)/g)?.length === 1 ? [shape, shape] : [shape],
)

export function spell(): Generated {
  const shape = randomFrom(shapePool)
  const expression = randomFrom(spellExpressions)
  const concept = randomFrom(spellConcepts)
  const verb = shape.includes('that') || shape.startsWith('As ') ? expression[1] : expression[0]
  let firstConcept = true
  const primary = shape
    .replace('A/The', () => (concept.uncountable ? 'The' : randomFrom(['A', 'The'])))
    .replace('Every ', concept.uncountable ? '' : 'Every ')
    .replace('must/shall', () => randomFrom(['must', 'shall']))
    .replace('(never)', () => (rng() < 0.5 ? 'never ' : ''))
    .replace(/\(concept\)/g, () => {
      if (firstConcept) {
        firstConcept = false
        return concept.value
      }
      return randomFrom(spellConcepts).value
    })
    .replace('(expression)', verb)
    .replace(/^A ([aeiou])/i, 'An $1')
    .replace(/^./, (letter) => letter.toUpperCase())
  const type = randomFrom(spellTypes)
  const article = /^[aeiou]/i.test(type) ? 'An' : 'A'
  return { primary, details: `${article} ${type} ${randomFrom(spellSources)}` }
}
