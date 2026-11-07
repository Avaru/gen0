import { randomFrom } from '@/helper/randomFrom'
import { rng } from '@/helper/rng'
import { mothershipClasses, type MothershipClass } from '@/data/mothership-classes'
import type { MothershipSkillId } from '@/data/characters/mothership-skills'
import { rollMothershipSkills } from './skills'

const stats = ['Str', 'Spd', 'Int', 'Cmb'] as const
const saves = ['San', 'Fea', 'Bod'] as const
type Scores = Record<(typeof stats)[number] | (typeof saves)[number], number>

export interface MothershipCharacter {
  characterClass: MothershipClass
  scores: Scores
  health: { current: number; max: number }
  wounds: { current: number; max: number }
  stress: { current: number; min: number }
  credits: number
  skills: MothershipSkillId[]
}

function rollD10(): number {
  return Math.floor(rng() * 10) + 1
}

function rollScore(base: number): number {
  return base + rollD10() + rollD10()
}

function rollScores(): Scores {
  return {
    Str: rollScore(25),
    Spd: rollScore(25),
    Int: rollScore(25),
    Cmb: rollScore(25),
    San: rollScore(10),
    Fea: rollScore(10),
    Bod: rollScore(10),
  }
}

function applyClassModifiers(scores: Scores, characterClass: MothershipClass): void {
  switch (characterClass) {
    case 'Marine':
      scores.Cmb += 10
      scores.Bod += 10
      scores.Fea += 20
      break
    case 'Android':
      scores.Int += 20
      scores[randomFrom(stats)] -= 10
      scores.Fea += 60
      break
    case 'Scientist':
      scores.Int += 10
      scores[randomFrom(stats)] += 5
      scores.San += 30
      break
    case 'Teamster':
      for (const stat of stats) scores[stat] += 5
      for (const save of saves) scores[save] += 10
      break
  }
}

export function rollMothershipCharacter(): MothershipCharacter {
  const characterClass = randomFrom(mothershipClasses)
  const scores = rollScores()
  applyClassModifiers(scores, characterClass)
  const maxHealth = rollD10() + 10
  const maxWounds = characterClass === 'Marine' || characterClass === 'Android' ? 3 : 2
  return {
    characterClass,
    scores,
    health: { current: maxHealth, max: maxHealth },
    wounds: { current: 0, max: maxWounds },
    stress: { current: 2, min: 2 },
    credits: (rollD10() + rollD10()) * 10,
    skills: rollMothershipSkills(characterClass),
  }
}
