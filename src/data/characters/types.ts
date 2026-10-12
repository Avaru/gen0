/** Framework-independent generator catalogue. IDs are stable; labels are editable. */
export type Id = string
export interface System {
  id: Id
  name: string
  attributeLabel: string
  skillLabel: string
  coreModuleId: Id
}
/** Attributes belong to a system, never to a flavor or generic archetype. */
export interface Attribute {
  id: Id
  systemId: Id
  key: string
  name: string
  sortOrder: number
}
export interface Skill {
  id: Id
  systemId: Id
  key: string
  name: string
  requiredModuleIds: Id[]
  sortOrder: number
}
export interface Archetype {
  id: Id
  name: string
  description: string
}
export interface Rating {
  definitionId: Id
  value: number
}
/** Two rating boxes on the editable CBR+PNK sheet; source profiles remain separate. */
export type SheetRating = 0 | 1 | 2 | null

/** The supplied Harm sheet has two slots at levels 1/2 and one at level 3. */
export type CharacterHarm =
  | { level: 1 | 2; description: string; marks: [boolean, boolean] }
  | { level: 3; description: string; marks: [boolean] }

export interface CharacterGear {
  level: 'light' | 'medium' | 'heavy'
  selected: string[]
  extra: boolean[]
}

/** Editable sheet values stay blank until entered; blank is different from zero. */
export interface CharacterSheet {
  systemId: Id
  runner: { alias: string; description: string; archetypeId?: Archetype['id']; angle?: string }
  attributeRatings: (Omit<Rating, 'value'> & { value: SheetRating })[]
  skillRatings: (Omit<Rating, 'value'> & { value: SheetRating })[]
  expertises: { skillId: Id; values: string[]; custom?: string }[]
  glitches: { attributeId: Id; marked: boolean }[]
  harm: CharacterHarm[]
  gear: CharacterGear
  stress: number
  specialArmor: boolean
  augmentations: { description: string; glitched: boolean }[]
}
/** Expertise is a suggested choice, not automatically granted alongside its rating. */
export interface ExpertiseSuggestion {
  skillId: Id
  options: string[]
  choose: 1
}
/** All profiles use complete vectors; omitted source values are explicitly seeded as zero. */
export interface ArchetypeSystemProfile {
  id: Id
  archetypeId: Id
  systemId: Id
  requiredModuleIds: Id[]
  sourceBuild: string
  mapping: 'direct' | 'adapted'
  attributeRatings: Rating[]
  skillRatings: Rating[]
  expertiseSuggestions: ExpertiseSuggestion[]
  notes: string[]
}
/** Only definitions consumed by runner generation and the editable sheet. */
export interface CharacterCatalogue {
  sources: { id: Id; title: string; url: string; note: string }[]
  systems: System[]
  attributes: Attribute[]
  skills: Skill[]
  archetypes: Archetype[]
  archetypeSystemProfiles: ArchetypeSystemProfile[]
}
