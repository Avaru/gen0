import type { RawBit } from '@/builders/types'

// Based on namegenerator/routes/single/sets/corporations.js, with user-supplied variations.
// [a|b] chooses one wording; $people$, $product$, and $corporation$ generate names.
// Stock-price effects are omitted.
export const corporationEvents: RawBit[] = [
  { value: 'Former [CEO|CTO|CTM] $people$ involved in [sex|porn|political|family|media|social media|rogue AI] scandal', tags: [] },
  { value: '[Successful|Surprising] market launch of $product$', tags: [] },
  { value: '[Impressive|Disappointing|Surprising] sales of $product$', tags: [] },
  { value: 'Recall of $product$ after [repeated accidents|a patent dispute|an AI incident|mysterious casualties]', tags: [] },
  { value: 'Finalized contract with $corporation$', tags: [] },
  { value: 'Nominated a top [10|100] company [in its field|despite competition]', tags: [] },
  { value: 'Fired [20|30|75]% of its workforce', tags: [] },
  { value: 'Upgraded its company-wide security system', tags: [] },
  { value: 'Involved in political scandal with $people$ of $corporation$', tags: [] },
  { value: 'Impressive quarterly numbers', tags: [] },
  { value: 'Mystery meat found in meals served in company cafeteria', tags: [] },
  { value: 'Design of $product$ [deemed ugly by|impressed|well reviewed by|made fun of by|praised by] [customers|reviewers|media|influencers]', tags: [] },
  // TODO: Handle cities separately later, replacing this inline city list with a shared pool.
  { value: 'Moved headquarters to [Seattle|Berlin|Paris|London|New York|Tokyo|Hong Kong]', tags: [] },
  { value: 'Leaked insider information', tags: [] },
  { value: 'Signed agreement with $corporation$', tags: [] },
  { value: 'Invested heavily in [security|R&D|marketing|social media]', tags: [] },
  { value: 'Corporate influencer got promoted to [CEO|CTO]', tags: [] },
]
