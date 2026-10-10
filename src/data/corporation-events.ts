import type { RawBit } from '@/builders/types'

// Migrated from namegenerator/routes/single/sets/corporations.js.
// Stock-price effects are omitted; only the original event text is retained.
export const corporationEvents: RawBit[] = [
  { value: 'Former CEO $people$ involved in sex scandal', tags: [] },
  { value: 'Successful market launch of $product$', tags: [] },
  { value: 'Disappointing sales of $product$', tags: [] },
  { value: 'Recall of $product$ after repeated accidents', tags: [] },
  { value: 'Finalized contract with $corporation$', tags: [] },
  { value: 'Nominated a top 100 company in its field', tags: [] },
  { value: 'Fired 20% of its workforce', tags: [] },
  { value: 'Upgraded its company-wide security system', tags: [] },
  { value: 'Involved in political scandal with $people$ of $corporation$', tags: [] },
  { value: 'Impressive quarterly numbers', tags: [] },
  { value: 'Mystery meat found in meals served in company cafeteria', tags: [] },
  { value: 'Design of $product$ deemed ugly by customers', tags: [] },
]
