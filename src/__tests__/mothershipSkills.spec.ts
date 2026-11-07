import { afterEach, expect, it, vi } from 'vitest'
import {
  mothershipSkills,
  mothershipSkillIds,
  type MothershipSkillId,
} from '@/data/characters/mothership-skills'
import { mothershipClasses } from '@/data/mothership-classes'
import { getEligibleMothershipSkills, rollMothershipSkills } from '@/patterns/mothership/skills'
import { seedRandom } from './helpers/random'

afterEach(() => vi.restoreAllMocks())

it('keeps every arrow within the next tier and includes the supplied 42 skills', () => {
  expect(mothershipSkillIds).toHaveLength(42)
  for (const id of mothershipSkillIds) {
    const skill = mothershipSkills[id]
    expect(skill.prerequisites.length > 0).toBe(skill.tier !== 'trained')
    for (const prerequisite of skill.prerequisites) {
      expect(mothershipSkills[prerequisite].tier).toBe(
        skill.tier === 'master' ? 'expert' : 'trained',
      )
      expect(getEligibleMothershipSkills([prerequisite], skill.tier)).toContain(id)
    }
    expect(getEligibleMothershipSkills([], skill.tier).includes(id)).toBe(skill.tier === 'trained')
    expect(getEligibleMothershipSkills([id], skill.tier)).not.toContain(id)
  }
})

it.each([
  ['zoology', ['psychology', 'pathology', 'field-medicine']],
  ['botany', ['pathology', 'ecology', 'wilderness-survival']],
  ['military-training', ['explosives', 'wilderness-survival', 'firearms', 'hand-to-hand-combat']],
  ['industrial-equipment', ['asteroid-mining', 'mechanical-repair']],
] as const)(
  'follows the branches from %s without treating crossings as connections',
  (id, expected) => {
    expect(getEligibleMothershipSkills([id], 'expert')).toEqual(expected)
  },
)

it('accepts either surgery prerequisite and keeps unrelated skills locked', () => {
  expect(getEligibleMothershipSkills(['pathology'], 'master')).toEqual(['exobiology', 'surgery'])
  expect(getEligibleMothershipSkills(['field-medicine'], 'master')).toEqual(['surgery'])
  expect(getEligibleMothershipSkills(['mechanical-repair'], 'master')).toEqual([
    'robotics',
    'engineering',
    'cybernetics',
  ])
  expect(getEligibleMothershipSkills(['physics'], 'master')).toEqual(['hyperspace'])
})

it.each(['Marine', 'Android'] as const)(
  'rolls both bonus options for %s without free prerequisite skills',
  (characterClass) => {
    for (const draw of [0, 0.999]) {
      vi.spyOn(Math, 'random').mockReturnValue(draw)
      const skills = rollMothershipSkills(characterClass)
      const trainedCount = skills.filter((id) => mothershipSkills[id].tier === 'trained').length
      const fixedCount = characterClass === 'Marine' ? 2 : 3
      expect(trainedCount).toBe(fixedCount + (draw === 0 ? 0 : 2))
      expect(skills.filter((id) => mothershipSkills[id].tier === 'expert')).toHaveLength(
        draw === 0 ? 1 : 0,
      )
      expect(new Set(skills).size).toBe(skills.length)
      vi.restoreAllMocks()
    }
  },
)

const masters = mothershipSkillIds.filter((id) => mothershipSkills[id].tier === 'master')
it.each(masters)(
  'gives Scientist a valid chain for %s plus one distinct Trained bonus',
  (master) => {
    vi.spyOn(Math, 'random')
      .mockReturnValue(0)
      .mockReturnValueOnce((masters.indexOf(master) + 0.5) / masters.length)
    const skills = rollMothershipSkills('Scientist')
    expect(skills).toHaveLength(4)
    expect(new Set(skills).size).toBe(4)
    expect(skills.filter((id) => mothershipSkills[id].tier === 'master')).toEqual([master])
    expect(skills.filter((id) => mothershipSkills[id].tier === 'expert')).toHaveLength(1)
    expect(skills.filter((id) => mothershipSkills[id].tier === 'trained')).toHaveLength(2)
    const expert = skills.find((id) => mothershipSkills[id].tier === 'expert')!
    expect(mothershipSkills[master].prerequisites).toContain(expert)
    expect(mothershipSkills[expert].prerequisites).toContain(skills[0])
  },
)

it('allows the Teamster bonus Trained skill to unlock its Expert bonus', () => {
  // First option, then Computers from the remaining Trained pool, then Hacking.
  vi.spyOn(Math, 'random')
    .mockReturnValueOnce(0)
    .mockReturnValueOnce(6.5 / 14)
    .mockReturnValueOnce(2.5 / 4)
  expect(rollMothershipSkills('Teamster')).toEqual([
    'industrial-equipment',
    'zero-g',
    'computers',
    'hacking',
  ])
})

it.each(mothershipClasses)(
  'keeps %s starting skills unique, eligible and within the class budget over repeated rolls',
  (characterClass) => {
    seedRandom()
    const fixed: Record<typeof characterClass, MothershipSkillId[]> = {
      Marine: ['military-training', 'athletics'],
      Android: ['linguistics', 'computers', 'mathematics'],
      Scientist: [],
      Teamster: ['industrial-equipment', 'zero-g'],
    }
    const budgets = {
      Marine: [
        [2, 1, 0],
        [4, 0, 0],
      ],
      Android: [
        [3, 1, 0],
        [5, 0, 0],
      ],
      Scientist: [[2, 1, 1]],
      Teamster: [[3, 1, 0]],
    }
    for (let roll = 0; roll < 200; roll++) {
      const skills = rollMothershipSkills(characterClass)
      expect(skills).toEqual(expect.arrayContaining(fixed[characterClass]))
      expect(new Set(skills).size).toBe(skills.length)
      const known: MothershipSkillId[] = []
      for (const id of skills) {
        expect(getEligibleMothershipSkills(known, mothershipSkills[id].tier)).toContain(id)
        known.push(id)
      }
      const trained = skills.filter((id) => mothershipSkills[id].tier === 'trained').length
      const expert = skills.filter((id) => mothershipSkills[id].tier === 'expert').length
      const master = skills.filter((id) => mothershipSkills[id].tier === 'master').length
      expect(budgets[characterClass]).toContainEqual([trained, expert, master])
    }
  },
)
