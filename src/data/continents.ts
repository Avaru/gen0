import type { NameRegion, SovereigntyNationality, SovereigntyMix } from './sovereignties'

export interface Continent extends NameRegion {
  coverage?: string
}
const mix = (...parts: [SovereigntyNationality, number][]): SovereigntyMix[] =>
  parts.map(([nationality, weight]) => ({ nationality, weight }))

// Broad browsing choices for generic cyberpunk, not census proportions.
// Each person uses a complete existing naming tradition. TODO pools are skipped.
export const continents: Continent[] = [
  {
    id: 'continent-africa', value: 'Africa', tags: ['cyberpunk'],
    mix: mix(['arabic', 1], ['ghanaian', 1]),
    coverage: 'Currently only the Arabic pool has names here; coverage of African traditions is still missing.',
  },
  {
    id: 'continent-asia', value: 'Asia', tags: ['cyberpunk'],
    mix: mix(['chinese', 4], ['japanese', 3], ['korean', 3], ['hindi', 3], ['tamil', 2], ['vietnamese', 3], ['arabic', 2], ['turkish', 2], ['russian', 1], ['filipino', 2]),
  },
  {
    id: 'continent-europe', value: 'Europe', tags: ['cyberpunk'],
    mix: mix(['german', 4], ['british', 4], ['french', 4], ['italian', 3], ['spanish', 3], ['dutch', 2], ['swedish', 2], ['polish', 2], ['greek', 1], ['russian', 2], ['ukrainian', 2], ['turkish', 1], ['arabic', 1], ['irish', 1], ['norwegian', 1], ['danish', 1], ['finnish', 1]),
  },
  {
    id: 'continent-north-america', value: 'North America', tags: ['cyberpunk'],
    mix: mix(['us-american', 8], ['french', 2], ['spanish', 3], ['chinese', 1], ['korean', 1], ['vietnamese', 1], ['hindi', 1], ['mexican', 5], ['salish', 1], ['lakota', 1], ['dakota', 1], ['pueblo', 1], ['navajo', 1]),
  },
  {
    id: 'continent-south-america', value: 'South America', tags: ['cyberpunk'],
    mix: mix(['spanish', 8], ['brazilian-portuguese', 6], ['japanese', 1]),
    coverage: 'Uses the existing Spanish and Japanese pools for now. Local Spanish-language and Indigenous traditions are not yet covered.',
  },
  {
    id: 'continent-oceania', value: 'Oceania', tags: ['cyberpunk'],
    mix: mix(['british', 8], ['us-american', 2], ['chinese', 1], ['hindi', 1], ['maori', 2], ['aboriginal-australian', 2]),
    coverage: 'Uses existing English-language, Chinese and Hindi pools for now; local Australian, New Zealand and Pacific traditions need their own data.',
  },
]
