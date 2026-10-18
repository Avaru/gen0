// Missing traditions used by regional mixes; these are labels, not name pools.
// Add sourced names AND their composition rules before removing TODO in the registry.
export const pendingNationalities = [
  { id: 'irish', label: 'Irish' },
  { id: 'norwegian', label: 'Norwegian' },
  { id: 'danish', label: 'Danish' },
  { id: 'finnish', label: 'Finnish' },
  { id: 'mexican', label: 'Mexican' },
  { id: 'brazilian-portuguese', label: 'Brazilian Portuguese' },
  { id: 'filipino', label: 'Filipino' },
  { id: 'ghanaian', label: 'Ghanaian' },
  { id: 'salish', label: 'Salish' },
  { id: 'lakota', label: 'Lakota' },
  { id: 'dakota', label: 'Dakota' },
  { id: 'pueblo', label: 'Pueblo' },
  { id: 'navajo', label: 'Navajo' },
  { id: 'maori', label: 'Māori' },
  { id: 'aboriginal-australian', label: 'Aboriginal Australian' },
] as const

export type PendingNationality = (typeof pendingNationalities)[number]['id']
