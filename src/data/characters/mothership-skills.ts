// Transcribed from the skill tree supplied by the user. Every prerequisite list means ANY.
export type MothershipSkillTier = 'trained' | 'expert' | 'master'

const skillDefinitions = {
  linguistics: { name: 'Linguistics', tier: 'trained', prerequisites: [] },
  zoology: { name: 'Zoology', tier: 'trained', prerequisites: [] },
  botany: { name: 'Botany', tier: 'trained', prerequisites: [] },
  geology: { name: 'Geology', tier: 'trained', prerequisites: [] },
  'industrial-equipment': { name: 'Industrial Equipment', tier: 'trained', prerequisites: [] },
  'jury-rigging': { name: 'Jury-Rigging', tier: 'trained', prerequisites: [] },
  chemistry: { name: 'Chemistry', tier: 'trained', prerequisites: [] },
  computers: { name: 'Computers', tier: 'trained', prerequisites: [] },
  'zero-g': { name: 'Zero-G', tier: 'trained', prerequisites: [] },
  mathematics: { name: 'Mathematics', tier: 'trained', prerequisites: [] },
  art: { name: 'Art', tier: 'trained', prerequisites: [] },
  archaeology: { name: 'Archaeology', tier: 'trained', prerequisites: [] },
  theology: { name: 'Theology', tier: 'trained', prerequisites: [] },
  'military-training': { name: 'Military Training', tier: 'trained', prerequisites: [] },
  rimwise: { name: 'Rimwise', tier: 'trained', prerequisites: [] },
  athletics: { name: 'Athletics', tier: 'trained', prerequisites: [] },
  psychology: { name: 'Psychology', tier: 'expert', prerequisites: ['linguistics', 'zoology'] },
  pathology: { name: 'Pathology', tier: 'expert', prerequisites: ['zoology', 'botany'] },
  'field-medicine': { name: 'Field Medicine', tier: 'expert', prerequisites: ['zoology'] },
  ecology: { name: 'Ecology', tier: 'expert', prerequisites: ['botany', 'geology'] },
  'asteroid-mining': {
    name: 'Asteroid Mining',
    tier: 'expert',
    prerequisites: ['geology', 'industrial-equipment'],
  },
  'mechanical-repair': {
    name: 'Mechanical Repair',
    tier: 'expert',
    prerequisites: ['industrial-equipment', 'jury-rigging'],
  },
  explosives: {
    name: 'Explosives',
    tier: 'expert',
    prerequisites: ['jury-rigging', 'chemistry', 'military-training'],
  },
  pharmacology: { name: 'Pharmacology', tier: 'expert', prerequisites: ['chemistry'] },
  hacking: { name: 'Hacking', tier: 'expert', prerequisites: ['computers'] },
  piloting: { name: 'Piloting', tier: 'expert', prerequisites: ['zero-g'] },
  physics: { name: 'Physics', tier: 'expert', prerequisites: ['mathematics'] },
  mysticism: {
    name: 'Mysticism',
    tier: 'expert',
    prerequisites: ['art', 'archaeology', 'theology'],
  },
  'wilderness-survival': {
    name: 'Wilderness Survival',
    tier: 'expert',
    prerequisites: ['botany', 'military-training'],
  },
  firearms: { name: 'Firearms', tier: 'expert', prerequisites: ['military-training', 'rimwise'] },
  'hand-to-hand-combat': {
    name: 'Hand-to-Hand Combat',
    tier: 'expert',
    prerequisites: ['military-training', 'rimwise', 'athletics'],
  },
  sophontology: { name: 'Sophontology', tier: 'master', prerequisites: ['psychology'] },
  exobiology: { name: 'Exobiology', tier: 'master', prerequisites: ['pathology'] },
  surgery: { name: 'Surgery', tier: 'master', prerequisites: ['pathology', 'field-medicine'] },
  planetology: {
    name: 'Planetology',
    tier: 'master',
    prerequisites: ['ecology', 'asteroid-mining'],
  },
  robotics: { name: 'Robotics', tier: 'master', prerequisites: ['mechanical-repair'] },
  engineering: { name: 'Engineering', tier: 'master', prerequisites: ['mechanical-repair'] },
  cybernetics: { name: 'Cybernetics', tier: 'master', prerequisites: ['mechanical-repair'] },
  'artificial-intelligence': {
    name: 'Artificial Intelligence',
    tier: 'master',
    prerequisites: ['hacking'],
  },
  hyperspace: {
    name: 'Hyperspace',
    tier: 'master',
    prerequisites: ['piloting', 'physics', 'mysticism'],
  },
  xenoesotericism: { name: 'Xenoesotericism', tier: 'master', prerequisites: ['mysticism'] },
  command: { name: 'Command', tier: 'master', prerequisites: ['piloting', 'firearms'] },
} as const satisfies Record<
  string,
  {
    name: string
    tier: MothershipSkillTier
    prerequisites: readonly string[]
  }
>

export type MothershipSkillId = keyof typeof skillDefinitions

export interface MothershipSkillDefinition {
  name: string
  tier: MothershipSkillTier
  prerequisites: readonly MothershipSkillId[]
}

// Also checks that every prerequisite refers to an existing skill.
export const mothershipSkills: Readonly<Record<MothershipSkillId, MothershipSkillDefinition>> =
  skillDefinitions
export const mothershipSkillIds = Object.keys(mothershipSkills) as MothershipSkillId[]
