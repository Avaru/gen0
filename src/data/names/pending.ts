import type { NameEntry } from '../nameTypes'

// Empty, editable pools requested for traditions needed by the sovereignty mixes.
// Add sourced names AND their composition rules before removing TODO in the registry.
export const pendingNationalities = [
  { id: 'irish', label: 'Irish', names: [] as NameEntry[] },
  { id: 'norwegian', label: 'Norwegian', names: [] as NameEntry[] },
  { id: 'danish', label: 'Danish', names: [] as NameEntry[] },
  { id: 'finnish', label: 'Finnish', names: [] as NameEntry[] },
  { id: 'mexican', label: 'Mexican', names: [] as NameEntry[] },
  { id: 'brazilian-portuguese', label: 'Brazilian Portuguese', names: [] as NameEntry[] },
  { id: 'filipino', label: 'Filipino', names: [] as NameEntry[] },
  { id: 'ghanaian', label: 'Ghanaian', names: [] as NameEntry[] },
  { id: 'salish', label: 'Salish', names: [] as NameEntry[] },
  { id: 'lakota', label: 'Lakota', names: [] as NameEntry[] },
  { id: 'dakota', label: 'Dakota', names: [] as NameEntry[] },
  { id: 'pueblo', label: 'Pueblo', names: [] as NameEntry[] },
  { id: 'navajo', label: 'Navajo', names: [] as NameEntry[] },
] as const

export type PendingNationality = typeof pendingNationalities[number]['id']
