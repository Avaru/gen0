import { deflateSync, inflateSync, strToU8, strFromU8 } from 'fflate'
import type { CharacterSheet } from '@/data/characters/types'

// Version 1 orders are fixed: never derive these positions from catalogue sorting.
const attributeIds = ['aggressive', 'smart', 'empathic', 'stealthy'].map(
  (key) => `cbr-pnk.attribute.${key}`,
)
const skillIds = [
  'analyze',
  'athletics',
  'close-combat',
  'coding',
  'influence',
  'piloting',
  'ranged-combat',
  'rigging',
  'sciences',
  'streetwise',
  'attune',
].map((key) => `cbr-pnk.skill.${key}`)
const maxBytes = 262144

function array(value: unknown, length: number): unknown[] {
  if (!Array.isArray(value) || value.length !== length) throw new Error('Invalid character link')
  return value
}

export function encodeCharacter(sheet: CharacterSheet): string {
  const compact = [
    1,
    [
      sheet.runner.alias,
      sheet.runner.description,
      sheet.runner.archetypeId ?? null,
      sheet.runner.angle ?? null,
    ],
    attributeIds.map((id) => sheet.attributeRatings.find((row) => row.definitionId === id)!.value),
    skillIds.map((id) => sheet.skillRatings.find((row) => row.definitionId === id)!.value),
    skillIds.map((id) => {
      const row = sheet.expertises.find((row) => row.skillId === id)!
      return [row.values, row.custom ?? null]
    }),
    attributeIds.map((id) => sheet.glitches.find((row) => row.attributeId === id)!.marked),
    sheet.harm.map((row) => [row.description, row.marks]),
    [sheet.gear.level, sheet.gear.selected, sheet.gear.extra],
    sheet.stress,
    sheet.specialArmor,
    sheet.augmentations.map((row) => [row.description, row.glitched]),
  ]
  const bytes = strToU8(JSON.stringify(compact))
  if (bytes.length >= maxBytes) throw new Error('Character is too large for a link')
  const compressed = deflateSync(bytes)
  let binary = ''
  for (const byte of compressed) binary += String.fromCharCode(byte)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** Returns untrusted sheet data; the store validates it before replacing any edits. */
export function decodeCharacter(token: string): unknown {
  if (!token || token.length > maxBytes * 2 || !/^[A-Za-z0-9_-]+$/.test(token))
    throw new Error('Invalid character link')
  const binary = atob(token.replace(/-/g, '+').replace(/_/g, '/'))
  const compressed = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  // A fixed output buffer bounds allocation even for hostile compressed input.
  const bytes = inflateSync(compressed, { out: new Uint8Array(maxBytes) })
  if (bytes.length >= maxBytes) throw new Error('Character is too large for a link')
  const data = array(JSON.parse(strFromU8(bytes)), 11)
  if (data[0] !== 1) throw new Error('Unsupported character link version')
  const runner = array(data[1], 4)
  const attributes = array(data[2], attributeIds.length)
  const skills = array(data[3], skillIds.length)
  const expertises = array(data[4], skillIds.length)
  const glitches = array(data[5], attributeIds.length)
  const harm = array(data[6], 3)
  const gear = array(data[7], 3)
  const augmentations = array(data[10], 3)
  return {
    systemId: 'cbr-pnk',
    runner: {
      alias: runner[0],
      description: runner[1],
      ...(runner[2] !== null ? { archetypeId: runner[2] } : {}),
      ...(runner[3] !== null ? { angle: runner[3] } : {}),
    },
    attributeRatings: attributeIds.map((definitionId, i) => ({
      definitionId,
      value: attributes[i],
    })),
    skillRatings: skillIds.map((definitionId, i) => ({ definitionId, value: skills[i] })),
    expertises: skillIds.map((skillId, i) => {
      const row = array(expertises[i], 2)
      return { skillId, values: row[0], ...(row[1] !== null ? { custom: row[1] } : {}) }
    }),
    glitches: attributeIds.map((attributeId, i) => ({ attributeId, marked: glitches[i] })),
    harm: harm.map((value, i) => {
      const row = array(value, 2)
      return { level: i + 1, description: row[0], marks: row[1] }
    }),
    gear: { level: gear[0], selected: gear[1], extra: gear[2] },
    stress: data[8],
    specialArmor: data[9],
    augmentations: augmentations.map((value) => {
      const row = array(value, 2)
      return { description: row[0], glitched: row[1] }
    }),
  }
}
