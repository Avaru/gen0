import type { Flavor as FlavorId } from '@/generator/options'

/** Framework-independent generator catalogue. IDs are stable; labels are editable. */
export type Id = string
export interface System {
  id: Id
  name: string
  attributeLabel: string
  skillLabel: string
  coreModuleId: Id
}
export interface SystemModule {
  id: Id
  systemId: Id
  name: string
  defaultEnabled: boolean
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

/** Editable sheet values stay blank until entered; blank is different from zero. */
export interface CharacterSheet {
  systemId: Id
  attributeRatings: (Omit<Rating, 'value'> & { value: SheetRating })[]
  skillRatings: (Omit<Rating, 'value'> & { value: SheetRating })[]
  expertises: { skillId: Id; value: string }[]
  glitches: { attributeId: Id; marked: boolean }[]
  harm: CharacterHarm[]
  stress: number
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
  suggestedAugmentationIds: Id[]
  notes: string[]
}
export interface AugmentationCategory {
  id: Id
  name: string
  description: string
}
/** Generic capabilities: categories do not imply a numeric bonus or a game rule. */
export interface Augmentation {
  id: Id
  name: string
  categoryIds: Id[]
  categorizationBasis: 'inferred-from-name'
  notes: string[]
}
export interface AugmentationSystemBinding {
  augmentationId: Id
  systemId: Id
  name: string
  requiredModuleIds: Id[]
}
/** Flavor means setting/aesthetic, independently of rules system or optional modules. */
export interface CharacterFlavor {
  id: FlavorId
  name: string
  description: string
}
/** Which mechanical aspects exist for this particular flavor/system pairing. */
export interface FlavorSystem {
  flavorId: FlavorId
  systemId: Id
  enabled: boolean
  availableAttributeIds: Id[]
  availableSkillIds: Id[]
  supportsAugmentations: boolean
}
export interface FlavorArchetype {
  flavorId: FlavorId
  archetypeId: Id
  enabled: boolean
  nameOverride: string | null
  descriptionOverride: string | null
}
/** Flavor availability uses explicit allowlists; no entry means unavailable. */
export interface FlavorAugmentation {
  flavorId: FlavorId
  augmentationId: Id
  enabled: boolean
  nameOverride: string | null
}
export interface CharacterGeneratorContext {
  systemId: Id
  enabledModuleIds: Id[]
  /** null selects the unconfigured catalogue, without flavor overrides. */
  flavorId: FlavorId | null
}
export interface CharacterCatalogue {
  schemaVersion: 1
  sources: { id: Id; title: string; url: string; note: string }[]
  systems: System[]
  systemModules: SystemModule[]
  attributes: Attribute[]
  skills: Skill[]
  archetypes: Archetype[]
  archetypeSystemProfiles: ArchetypeSystemProfile[]
  augmentationCategories: AugmentationCategory[]
  augmentations: Augmentation[]
  augmentationSystemBindings: AugmentationSystemBinding[]
  flavors: CharacterFlavor[]
  flavorSystems: FlavorSystem[]
  flavorArchetypes: FlavorArchetype[]
  flavorAugmentations: FlavorAugmentation[]
  unmappedArchetypes: { archetypeId: Id; systemId: Id; reason: string }[]
}
