import { mothershipClassSkillRules } from '@/data/characters/mothership-rules'
import {
  mothershipSkills,
  mothershipSkillIds,
  type MothershipSkillId,
  type MothershipSkillTier,
} from '@/data/characters/mothership-skills'
import type { MothershipClass } from '@/data/mothership-classes'
import { randomFrom } from '@/helper/randomFrom'

export function getEligibleMothershipSkills(
  known: readonly MothershipSkillId[],
  tier: MothershipSkillTier,
): MothershipSkillId[] {
  return mothershipSkillIds.filter((id) => {
    const skill = mothershipSkills[id]
    return (
      skill.tier === tier &&
      !known.includes(id) &&
      (skill.prerequisites.length === 0 ||
        skill.prerequisites.some((prerequisite) => known.includes(prerequisite)))
    )
  })
}

export function rollMothershipSkills(characterClass: MothershipClass): MothershipSkillId[] {
  const rules = mothershipClassSkillRules[characterClass]
  const known = [...rules.fixed]

  function addWithPrerequisite(id: MothershipSkillId): void {
    if (known.includes(id)) return
    const { prerequisites } = mothershipSkills[id]
    if (
      prerequisites.length &&
      !prerequisites.some((prerequisite) => known.includes(prerequisite))
    ) {
      addWithPrerequisite(randomFrom(prerequisites))
    }
    known.push(id)
  }

  if (rules.prerequisiteChain) {
    addWithPrerequisite(
      randomFrom(
        mothershipSkillIds.filter((id) => mothershipSkills[id].tier === rules.prerequisiteChain),
      ),
    )
  }
  for (const tier of randomFrom(rules.bonusChoices)) {
    known.push(randomFrom(getEligibleMothershipSkills(known, tier)))
  }
  return known
}
