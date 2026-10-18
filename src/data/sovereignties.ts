import type { RawBit } from '@/builders/types'
import type { PendingNationality } from './names/pending'
import type { NameNationality } from '@/patterns/cyberpunk/nationality/nameParts'

export type SovereigntyNationality = NameNationality | PendingNationality
export type SovereigntyMix = { nationality: SovereigntyNationality; weight: number }
export interface NameRegion extends RawBit {
  id: string
  mix: SovereigntyMix[]
}
export type Sovereignty = NameRegion

const sr = 'shadowrun'
const cp = 'cyberpunk2020-2077'
const srWiki = 'https://shadowrun.fandom.com/wiki/'
const cpWiki = 'https://cyberpunk.fandom.com/wiki/'
const mix = (...parts: [SovereigntyNationality, number][]): SovereigntyMix[] =>
  parts.map(([nationality, weight]) => ({ nationality, weight }))

// Relative generator weights, NOT canon census percentages. Pick a complete
// national naming tradition per person. Missing TODO traditions are skipped.
// See docs/sovereignty-name-sources.md for geography, eras and coverage limits.
export const sovereignties: Sovereignty[] = [
  {
    id: 'ucas',
    value: 'UCAS — United Canadian and American States',
    tags: [sr],
    source: `${srWiki}United_Canadian_and_American_States`,
    mix: mix(
      ['us-american', 12],
      ['french', 2],
      ['chinese', 1],
      ['korean', 1],
      ['hindi', 1],
      ['spanish', 1],
    ),
  },
  {
    id: 'cas',
    value: 'CAS — Confederation of American States',
    tags: [sr],
    source: `${srWiki}Confederation_of_American_States`,
    mix: mix(['us-american', 12], ['spanish', 2], ['french', 1], ['vietnamese', 1]),
  },
  {
    id: 'california-free-state',
    value: 'California Free State',
    tags: [sr],
    source: `${srWiki}California_Free_State`,
    mix: mix(
      ['us-american', 8],
      ['mexican', 5],
      ['spanish', 3],
      ['japanese', 2],
      ['chinese', 2],
      ['korean', 1],
      ['vietnamese', 1],
    ),
  },
  {
    id: 'aztlan',
    value: 'Aztlan',
    tags: [sr],
    source: `${srWiki}Aztlan`,
    mix: mix(['mexican', 10], ['spanish', 8], ['us-american', 1]),
  },
  {
    id: 'tir-tairngire',
    value: 'Tír Tairngire',
    tags: [sr],
    source: `${srWiki}T%C3%ADr_Tairngire`,
    mix: mix(['us-american', 8], ['irish', 2], ['british', 2], ['japanese', 1], ['chinese', 1]),
  },
  {
    id: 'tir-na-nog',
    value: 'Tír na nÓg',
    tags: [sr],
    source: `${srWiki}T%C3%ADr_na_n%C3%93g`,
    mix: mix(['irish', 12], ['british', 3], ['french', 1]),
  },
  {
    id: 'native-american-nations',
    value: 'Native American Nations',
    tags: [sr],
    source: `${srWiki}Native_American_Nations`,
    mix: mix(
      ['salish', 4],
      ['lakota', 3],
      ['dakota', 3],
      ['pueblo', 3],
      ['navajo', 3],
      ['us-american', 4],
      ['spanish', 1],
    ),
  },
  {
    id: 'germany',
    value: 'Germany',
    flavorNames: { shadowrun: 'ADL — Allied German States' },
    tags: [sr],
    source: `${srWiki}Allied_German_States`,
    mix: mix(['german', 12], ['turkish', 3], ['polish', 2], ['italian', 1], ['arabic', 1]),
  },
  {
    id: 'europe',
    value: 'Europe',
    tags: [sr, cp],
    source: `${cpWiki}European_Economic_Community`,
    mix: mix(
      ['german', 4],
      ['british', 4],
      ['french', 4],
      ['italian', 3],
      ['spanish', 3],
      ['dutch', 2],
      ['swedish', 2],
      ['polish', 2],
      ['greek', 1],
      ['turkish', 1],
      ['arabic', 1],
      ['irish', 1],
      ['norwegian', 1],
      ['danish', 1],
      ['finnish', 1],
    ),
  },
  {
    id: 'russia',
    value: 'Russian Republic',
    tags: [sr],
    source: `${srWiki}Russia`,
    mix: mix(['russian', 12], ['ukrainian', 2], ['korean', 1], ['chinese', 1]),
  },
  {
    id: 'japan',
    value: 'Japan',
    flavorNames: { shadowrun: 'Japanese Imperial State' },
    tags: [sr, cp],
    source: `${srWiki}Japanese_Imperial_State`,
    mix: mix(['japanese', 16], ['korean', 2], ['chinese', 1]),
  },
  {
    id: 'india',
    value: 'India',
    flavorNames: { shadowrun: 'Indian Union' },
    tags: [sr, cp],
    source: `${srWiki}Indian_Union`,
    mix: mix(['hindi', 6], ['tamil', 4]),
  },
  {
    id: 'chinese-successor-states',
    value: 'Chinese successor states',
    tags: [sr],
    source: `${srWiki}China`,
    mix: mix(['chinese', 16], ['korean', 1], ['vietnamese', 1], ['russian', 1]),
  },
  {
    id: 'amazonian-state',
    value: 'Amazonia',
    tags: [sr],
    source: `${srWiki}Amazonia`,
    mix: mix(['brazilian-portuguese', 12], ['spanish', 3], ['japanese', 1]),
  },
  {
    id: 'asamando',
    value: 'Asamando',
    tags: [sr],
    source: `${srWiki}Asamando`,
    mix: mix(['ghanaian', 1]),
  },
  {
    id: 'nusa',
    value: 'NUSA — New United States of America',
    tags: [cp],
    source: `${cpWiki}New_United_States`,
    mix: mix(
      ['us-american', 12],
      ['mexican', 4],
      ['spanish', 3],
      ['chinese', 1],
      ['korean', 1],
      ['vietnamese', 1],
    ),
  },
  {
    id: 'night-city',
    value: 'Night City',
    tags: [cp],
    source: `${cpWiki}Night_City`,
    mix: mix(
      ['us-american', 6],
      ['mexican', 4],
      ['spanish', 3],
      ['japanese', 3],
      ['chinese', 2],
      ['korean', 1],
      ['hindi', 1],
      ['russian', 1],
      ['vietnamese', 1],
      ['filipino', 1],
    ),
  },
  {
    id: 'free-states',
    value: 'Free States',
    tags: [cp],
    source: `${cpWiki}Unification_War`,
    mix: mix(
      ['us-american', 10],
      ['mexican', 6],
      ['spanish', 4],
      ['chinese', 2],
      ['japanese', 2],
      ['vietnamese', 1],
    ),
  },
  {
    id: 'soviet-union',
    value: 'USSR — Union of Sovereign Soviet Republics',
    tags: [cp],
    source: `${cpWiki}Soviet_Union`,
    mix: mix(['russian', 12], ['ukrainian', 4], ['korean', 1]),
  },
  {
    id: 'china',
    value: 'China',
    tags: [cp],
    source: `${cpWiki}China`,
    mix: mix(['chinese', 16], ['korean', 1], ['vietnamese', 1]),
  },
]
