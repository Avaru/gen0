import { defineStore } from 'pinia'
import { cbrPnkCatalogue } from '@/data/characters/cbr-pnk'
import type { CharacterSheet } from '@/data/characters/types'

export const useCharacterStore = defineStore('character', {
  state: () => {
    const system = cbrPnkCatalogue.systems.find((item) => item.id === 'cbr-pnk')!
    const attributes = cbrPnkCatalogue.attributes
      .filter((item) => item.systemId === system.id)
      .sort((a, b) => a.sortOrder - b.sortOrder)
    const skills = cbrPnkCatalogue.skills
      .filter((item) => item.systemId === system.id)
      .sort((a, b) => a.sortOrder - b.sortOrder)
    const sheet: CharacterSheet = {
      systemId: system.id,
      stress: 0,
      augmentations: Array.from({ length: 3 }, () => ({ description: '', glitched: false })),
      attributeRatings: attributes.map((item) => ({ definitionId: item.id, value: null })),
      skillRatings: skills.map((item) => ({ definitionId: item.id, value: null })),
      expertises: skills.map((item) => ({ skillId: item.id, value: '' })),
      glitches: attributes.map((item) => ({ attributeId: item.id, marked: false })),
      harm: [
        { level: 1, description: '', marks: [false, false] },
        { level: 2, description: '', marks: [false, false] },
        { level: 3, description: '', marks: [false] },
      ],
    }
    return { system, attributes, skills, sheet }
  },
})
