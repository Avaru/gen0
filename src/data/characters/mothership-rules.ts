import type { MothershipClass } from '@/data/mothership-classes'
import type { MothershipSkillId, MothershipSkillTier } from './mothership-skills'

interface ClassSkillRules {
  fixed: readonly MothershipSkillId[]
  prerequisiteChain?: MothershipSkillTier
  // Choose one option equally, then fill its slots in order without duplicates.
  bonusChoices: readonly (readonly MothershipSkillTier[])[]
}

// Transcribed from the class starting-skills image supplied by the user.
export const mothershipClassSkillRules: Record<MothershipClass, ClassSkillRules> = {
  Marine: {
    fixed: ['military-training', 'athletics'],
    bonusChoices: [['expert'], ['trained', 'trained']],
  },
  Android: {
    fixed: ['linguistics', 'computers', 'mathematics'],
    bonusChoices: [['expert'], ['trained', 'trained']],
  },
  Scientist: {
    fixed: [],
    prerequisiteChain: 'master',
    bonusChoices: [['trained']],
  },
  Teamster: {
    fixed: ['industrial-equipment', 'zero-g'],
    bonusChoices: [['trained', 'expert']],
  },
}
