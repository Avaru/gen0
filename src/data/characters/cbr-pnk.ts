import type { CharacterCatalogue } from './types'

// Active sheet definitions and profiles from the supplied CBR+PNK import.
export const cbrPnkCatalogue = {
  sources: [
    {
      id: 'conversation-build-list',
      title: 'CBR+PNK Character Creation Aid by Jonathan Loy \u2014 conversation extraction',
      url: 'https://www.scribd.com/document/871960255/CBR-PNK-Character-Creation-Aid',
      note: 'Seeded from the values already displayed in this conversation; not independently checked against original PDF pages. Generic archetype mappings are design choices.',
    },
  ],
  systems: [
    {
      id: 'cbr-pnk',
      name: 'CBR+PNK',
      attributeLabel: 'Approaches',
      skillLabel: 'Skills',
      coreModuleId: 'cbr-pnk.core',
    },
  ],
  attributes: [
    {
      id: 'cbr-pnk.attribute.aggressive',
      systemId: 'cbr-pnk',
      key: 'aggressive',
      name: 'Aggressive',
      sortOrder: 0,
    },
    {
      id: 'cbr-pnk.attribute.smart',
      systemId: 'cbr-pnk',
      key: 'smart',
      name: 'Smart',
      sortOrder: 1,
    },
    {
      id: 'cbr-pnk.attribute.empathic',
      systemId: 'cbr-pnk',
      key: 'empathic',
      name: 'Empathic',
      sortOrder: 2,
    },
    {
      id: 'cbr-pnk.attribute.stealthy',
      systemId: 'cbr-pnk',
      key: 'stealthy',
      name: 'Stealthy',
      sortOrder: 3,
    },
  ],
  skills: [
    {
      id: 'cbr-pnk.skill.analyze',
      systemId: 'cbr-pnk',
      key: 'analyze',
      name: 'Analyze',
      requiredModuleIds: ['cbr-pnk.core'],
      sortOrder: 0,
    },
    {
      id: 'cbr-pnk.skill.athletics',
      systemId: 'cbr-pnk',
      key: 'athletics',
      name: 'Athletics',
      requiredModuleIds: ['cbr-pnk.core'],
      sortOrder: 1,
    },
    {
      id: 'cbr-pnk.skill.close-combat',
      systemId: 'cbr-pnk',
      key: 'close-combat',
      name: 'Close Combat',
      requiredModuleIds: ['cbr-pnk.core'],
      sortOrder: 2,
    },
    {
      id: 'cbr-pnk.skill.coding',
      systemId: 'cbr-pnk',
      key: 'coding',
      name: 'Coding',
      requiredModuleIds: ['cbr-pnk.core'],
      sortOrder: 3,
    },
    {
      id: 'cbr-pnk.skill.influence',
      systemId: 'cbr-pnk',
      key: 'influence',
      name: 'Influence',
      requiredModuleIds: ['cbr-pnk.core'],
      sortOrder: 4,
    },
    {
      id: 'cbr-pnk.skill.piloting',
      systemId: 'cbr-pnk',
      key: 'piloting',
      name: 'Piloting',
      requiredModuleIds: ['cbr-pnk.core'],
      sortOrder: 5,
    },
    {
      id: 'cbr-pnk.skill.ranged-combat',
      systemId: 'cbr-pnk',
      key: 'ranged-combat',
      name: 'Ranged Combat',
      requiredModuleIds: ['cbr-pnk.core'],
      sortOrder: 6,
    },
    {
      id: 'cbr-pnk.skill.rigging',
      systemId: 'cbr-pnk',
      key: 'rigging',
      name: 'Rigging',
      requiredModuleIds: ['cbr-pnk.core'],
      sortOrder: 7,
    },
    {
      id: 'cbr-pnk.skill.sciences',
      systemId: 'cbr-pnk',
      key: 'sciences',
      name: 'Sciences',
      requiredModuleIds: ['cbr-pnk.core'],
      sortOrder: 8,
    },
    {
      id: 'cbr-pnk.skill.streetwise',
      systemId: 'cbr-pnk',
      key: 'streetwise',
      name: 'Streetwise',
      requiredModuleIds: ['cbr-pnk.core'],
      sortOrder: 9,
    },
    {
      id: 'cbr-pnk.skill.attune',
      systemId: 'cbr-pnk',
      key: 'attune',
      name: 'Attune',
      requiredModuleIds: ['cbr-pnk.core', 'cbr-pnk.weird'],
      sortOrder: 10,
    },
  ],
  archetypes: [
    {
      id: 'hacker',
      name: 'Hacker',
      description: 'Accesses and manipulates digital systems.',
    },
    {
      id: 'driver',
      name: 'Driver',
      description: 'Handles vehicles and dangerous transport.',
    },
    {
      id: 'face',
      name: 'Face',
      description: 'Builds trust, negotiates, and influences people.',
    },
    {
      id: 'rigger',
      name: 'Rigger',
      description: 'Repairs and operates technical equipment.',
    },
    {
      id: 'infiltrator',
      name: 'Infiltrator',
      description: 'Enters secured places and avoids detection.',
    },
    {
      id: 'analyst',
      name: 'Analyst',
      description: 'Examines evidence and reconstructs events.',
    },
    {
      id: 'marksman',
      name: 'Marksman',
      description: 'Specializes in precise ranged attacks.',
    },
    {
      id: 'scientist',
      name: 'Scientist',
      description: 'Studies complex phenomena and applies scientific expertise.',
    },
    {
      id: 'brawler',
      name: 'Brawler',
      description: 'Handles physical confrontation.',
    },
    {
      id: 'shaman',
      name: 'Shaman',
      description: 'Works with spirits, rituals, or supernatural artifacts.',
    },
    {
      id: 'technomancer',
      name: 'Technomancer',
      description: 'Combines technology with supernatural practice.',
    },
    {
      id: 'mage',
      name: 'Mage',
      description: 'Practices magic.',
    },
    {
      id: 'street-samurai',
      name: 'Street Samurai',
      description: 'Combines weapon mastery with personal augmentation.',
    },
  ],
  archetypeSystemProfiles: [
    {
      id: 'cbr-pnk.profile.hacker',
      archetypeId: 'hacker',
      systemId: 'cbr-pnk',
      requiredModuleIds: ['cbr-pnk.core'],
      sourceBuild: 'Console Cowgirl',
      mapping: 'direct',
      attributeRatings: [
        {
          definitionId: 'cbr-pnk.attribute.aggressive',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.attribute.smart',
          value: 2,
        },
        {
          definitionId: 'cbr-pnk.attribute.empathic',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.attribute.stealthy',
          value: 1,
        },
      ],
      skillRatings: [
        {
          definitionId: 'cbr-pnk.skill.analyze',
          value: 2,
        },
        {
          definitionId: 'cbr-pnk.skill.athletics',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.close-combat',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.coding',
          value: 3,
        },
        {
          definitionId: 'cbr-pnk.skill.influence',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.piloting',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.ranged-combat',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.rigging',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.sciences',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.streetwise',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.attune',
          value: 0,
        },
      ],
      expertiseSuggestions: [
        {
          skillId: 'cbr-pnk.skill.coding',
          options: ['Hacking'],
          choose: 1,
        },
      ],
      notes: [],
    },
    {
      id: 'cbr-pnk.profile.driver',
      archetypeId: 'driver',
      systemId: 'cbr-pnk',
      requiredModuleIds: ['cbr-pnk.core'],
      sourceBuild: 'Daredevil',
      mapping: 'direct',
      attributeRatings: [
        {
          definitionId: 'cbr-pnk.attribute.aggressive',
          value: 2,
        },
        {
          definitionId: 'cbr-pnk.attribute.smart',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.attribute.empathic',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.attribute.stealthy',
          value: 0,
        },
      ],
      skillRatings: [
        {
          definitionId: 'cbr-pnk.skill.analyze',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.athletics',
          value: 2,
        },
        {
          definitionId: 'cbr-pnk.skill.close-combat',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.coding',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.influence',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.piloting',
          value: 3,
        },
        {
          definitionId: 'cbr-pnk.skill.ranged-combat',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.rigging',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.sciences',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.streetwise',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.attune',
          value: 0,
        },
      ],
      expertiseSuggestions: [
        {
          skillId: 'cbr-pnk.skill.piloting',
          options: ['Cars', 'Planes', 'Motorcycles'],
          choose: 1,
        },
      ],
      notes: [],
    },
    {
      id: 'cbr-pnk.profile.face',
      archetypeId: 'face',
      systemId: 'cbr-pnk',
      requiredModuleIds: ['cbr-pnk.core'],
      sourceBuild: 'Face',
      mapping: 'direct',
      attributeRatings: [
        {
          definitionId: 'cbr-pnk.attribute.aggressive',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.attribute.smart',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.attribute.empathic',
          value: 2,
        },
        {
          definitionId: 'cbr-pnk.attribute.stealthy',
          value: 1,
        },
      ],
      skillRatings: [
        {
          definitionId: 'cbr-pnk.skill.analyze',
          value: 2,
        },
        {
          definitionId: 'cbr-pnk.skill.athletics',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.close-combat',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.coding',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.influence',
          value: 3,
        },
        {
          definitionId: 'cbr-pnk.skill.piloting',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.ranged-combat',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.rigging',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.sciences',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.streetwise',
          value: 2,
        },
        {
          definitionId: 'cbr-pnk.skill.attune',
          value: 0,
        },
      ],
      expertiseSuggestions: [
        {
          skillId: 'cbr-pnk.skill.influence',
          options: ['Negotiate', 'Perform'],
          choose: 1,
        },
      ],
      notes: [],
    },
    {
      id: 'cbr-pnk.profile.rigger',
      archetypeId: 'rigger',
      systemId: 'cbr-pnk',
      requiredModuleIds: ['cbr-pnk.core'],
      sourceBuild: 'Gearhead',
      mapping: 'adapted',
      attributeRatings: [
        {
          definitionId: 'cbr-pnk.attribute.aggressive',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.attribute.smart',
          value: 2,
        },
        {
          definitionId: 'cbr-pnk.attribute.empathic',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.attribute.stealthy',
          value: 0,
        },
      ],
      skillRatings: [
        {
          definitionId: 'cbr-pnk.skill.analyze',
          value: 2,
        },
        {
          definitionId: 'cbr-pnk.skill.athletics',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.close-combat',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.coding',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.influence',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.piloting',
          value: 2,
        },
        {
          definitionId: 'cbr-pnk.skill.ranged-combat',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.rigging',
          value: 3,
        },
        {
          definitionId: 'cbr-pnk.skill.sciences',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.streetwise',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.attune',
          value: 0,
        },
      ],
      expertiseSuggestions: [
        {
          skillId: 'cbr-pnk.skill.rigging',
          options: ['Electronics'],
          choose: 1,
        },
      ],
      notes: [
        'Uses Gearhead ratings. Puppetmaster remains an alternative, unseeded build focused on drones.',
      ],
    },
    {
      id: 'cbr-pnk.profile.infiltrator',
      archetypeId: 'infiltrator',
      systemId: 'cbr-pnk',
      requiredModuleIds: ['cbr-pnk.core'],
      sourceBuild: 'Infiltrator',
      mapping: 'direct',
      attributeRatings: [
        {
          definitionId: 'cbr-pnk.attribute.aggressive',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.attribute.smart',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.attribute.empathic',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.attribute.stealthy',
          value: 2,
        },
      ],
      skillRatings: [
        {
          definitionId: 'cbr-pnk.skill.analyze',
          value: 2,
        },
        {
          definitionId: 'cbr-pnk.skill.athletics',
          value: 2,
        },
        {
          definitionId: 'cbr-pnk.skill.close-combat',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.coding',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.influence',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.piloting',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.ranged-combat',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.rigging',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.sciences',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.streetwise',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.attune',
          value: 0,
        },
      ],
      expertiseSuggestions: [],
      notes: [
        'The extracted augmentation list ends with a trailing comma. No missing augmentation is invented.',
      ],
    },
    {
      id: 'cbr-pnk.profile.analyst',
      archetypeId: 'analyst',
      systemId: 'cbr-pnk',
      requiredModuleIds: ['cbr-pnk.core'],
      sourceBuild: 'Investigator',
      mapping: 'direct',
      attributeRatings: [
        {
          definitionId: 'cbr-pnk.attribute.aggressive',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.attribute.smart',
          value: 2,
        },
        {
          definitionId: 'cbr-pnk.attribute.empathic',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.attribute.stealthy',
          value: 0,
        },
      ],
      skillRatings: [
        {
          definitionId: 'cbr-pnk.skill.analyze',
          value: 3,
        },
        {
          definitionId: 'cbr-pnk.skill.athletics',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.close-combat',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.coding',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.influence',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.piloting',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.ranged-combat',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.rigging',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.sciences',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.streetwise',
          value: 2,
        },
        {
          definitionId: 'cbr-pnk.skill.attune',
          value: 0,
        },
      ],
      expertiseSuggestions: [
        {
          skillId: 'cbr-pnk.skill.analyze',
          options: ['People', 'Situations'],
          choose: 1,
        },
      ],
      notes: [
        'The source has no augmentation suggestions. Empty suggestions do not prohibit augmentations.',
      ],
    },
    {
      id: 'cbr-pnk.profile.marksman',
      archetypeId: 'marksman',
      systemId: 'cbr-pnk',
      requiredModuleIds: ['cbr-pnk.core'],
      sourceBuild: 'Marksman',
      mapping: 'direct',
      attributeRatings: [
        {
          definitionId: 'cbr-pnk.attribute.aggressive',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.attribute.smart',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.attribute.empathic',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.attribute.stealthy',
          value: 2,
        },
      ],
      skillRatings: [
        {
          definitionId: 'cbr-pnk.skill.analyze',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.athletics',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.close-combat',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.coding',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.influence',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.piloting',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.ranged-combat',
          value: 3,
        },
        {
          definitionId: 'cbr-pnk.skill.rigging',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.sciences',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.streetwise',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.attune',
          value: 0,
        },
      ],
      expertiseSuggestions: [
        {
          skillId: 'cbr-pnk.skill.ranged-combat',
          options: ['Rifle'],
          choose: 1,
        },
      ],
      notes: [],
    },
    {
      id: 'cbr-pnk.profile.scientist',
      archetypeId: 'scientist',
      systemId: 'cbr-pnk',
      requiredModuleIds: ['cbr-pnk.core', 'cbr-pnk.weird'],
      sourceBuild: 'Weird Scientist',
      mapping: 'adapted',
      attributeRatings: [
        {
          definitionId: 'cbr-pnk.attribute.aggressive',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.attribute.smart',
          value: 2,
        },
        {
          definitionId: 'cbr-pnk.attribute.empathic',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.attribute.stealthy',
          value: 1,
        },
      ],
      skillRatings: [
        {
          definitionId: 'cbr-pnk.skill.analyze',
          value: 2,
        },
        {
          definitionId: 'cbr-pnk.skill.athletics',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.close-combat',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.coding',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.influence',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.piloting',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.ranged-combat',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.rigging',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.sciences',
          value: 3,
        },
        {
          definitionId: 'cbr-pnk.skill.streetwise',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.attune',
          value: 2,
        },
      ],
      expertiseSuggestions: [
        {
          skillId: 'cbr-pnk.skill.sciences',
          options: ['Biotech', 'Paranormal Sciences'],
          choose: 1,
        },
      ],
      notes: [
        'This source build requires the weird module. No mundane scientist ratings have been invented.',
      ],
    },
    {
      id: 'cbr-pnk.profile.brawler',
      archetypeId: 'brawler',
      systemId: 'cbr-pnk',
      requiredModuleIds: ['cbr-pnk.core'],
      sourceBuild: 'Soldier',
      mapping: 'adapted',
      attributeRatings: [
        {
          definitionId: 'cbr-pnk.attribute.aggressive',
          value: 2,
        },
        {
          definitionId: 'cbr-pnk.attribute.smart',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.attribute.empathic',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.attribute.stealthy',
          value: 1,
        },
      ],
      skillRatings: [
        {
          definitionId: 'cbr-pnk.skill.analyze',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.athletics',
          value: 2,
        },
        {
          definitionId: 'cbr-pnk.skill.close-combat',
          value: 2,
        },
        {
          definitionId: 'cbr-pnk.skill.coding',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.influence',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.piloting',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.ranged-combat',
          value: 2,
        },
        {
          definitionId: 'cbr-pnk.skill.rigging',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.sciences',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.streetwise',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.attune',
          value: 0,
        },
      ],
      expertiseSuggestions: [],
      notes: [
        'Uses Soldier ratings unchanged, including Ranged Combat 2; this is not a redesigned melee specialist.',
      ],
    },
    {
      id: 'cbr-pnk.profile.shaman',
      archetypeId: 'shaman',
      systemId: 'cbr-pnk',
      requiredModuleIds: ['cbr-pnk.core', 'cbr-pnk.weird'],
      sourceBuild: 'Witch Doctor',
      mapping: 'adapted',
      attributeRatings: [
        {
          definitionId: 'cbr-pnk.attribute.aggressive',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.attribute.smart',
          value: 2,
        },
        {
          definitionId: 'cbr-pnk.attribute.empathic',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.attribute.stealthy',
          value: 1,
        },
      ],
      skillRatings: [
        {
          definitionId: 'cbr-pnk.skill.analyze',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.athletics',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.close-combat',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.coding',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.influence',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.piloting',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.ranged-combat',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.rigging',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.sciences',
          value: 2,
        },
        {
          definitionId: 'cbr-pnk.skill.streetwise',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.attune',
          value: 3,
        },
      ],
      expertiseSuggestions: [
        {
          skillId: 'cbr-pnk.skill.attune',
          options: ['Artifacts'],
          choose: 1,
        },
      ],
      notes: [
        'No augmentation links by design. Original source suggestions retained for reference only: appearance-scrambler, toxin-fangs.',
      ],
    },
    {
      id: 'cbr-pnk.profile.technomancer',
      archetypeId: 'technomancer',
      systemId: 'cbr-pnk',
      requiredModuleIds: ['cbr-pnk.core', 'cbr-pnk.weird'],
      sourceBuild: 'Technoshaman',
      mapping: 'adapted',
      attributeRatings: [
        {
          definitionId: 'cbr-pnk.attribute.aggressive',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.attribute.smart',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.attribute.empathic',
          value: 2,
        },
        {
          definitionId: 'cbr-pnk.attribute.stealthy',
          value: 0,
        },
      ],
      skillRatings: [
        {
          definitionId: 'cbr-pnk.skill.analyze',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.athletics',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.close-combat',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.coding',
          value: 2,
        },
        {
          definitionId: 'cbr-pnk.skill.influence',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.piloting',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.ranged-combat',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.rigging',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.sciences',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.streetwise',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.attune',
          value: 3,
        },
      ],
      expertiseSuggestions: [
        {
          skillId: 'cbr-pnk.skill.attune',
          options: ['Spirits'],
          choose: 1,
        },
      ],
      notes: [
        'No augmentation links by design. Original source suggestions retained for reference only: pheromone-excretor, wireless-datajack.',
        'Source expertise is Spirits; renamed archetype does not change its mechanical focus.',
      ],
    },
    {
      id: 'cbr-pnk.profile.street-samurai',
      archetypeId: 'street-samurai',
      systemId: 'cbr-pnk',
      requiredModuleIds: ['cbr-pnk.core'],
      sourceBuild: 'Street Samurai',
      mapping: 'direct',
      attributeRatings: [
        {
          definitionId: 'cbr-pnk.attribute.aggressive',
          value: 2,
        },
        {
          definitionId: 'cbr-pnk.attribute.smart',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.attribute.empathic',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.attribute.stealthy',
          value: 1,
        },
      ],
      skillRatings: [
        {
          definitionId: 'cbr-pnk.skill.analyze',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.athletics',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.close-combat',
          value: 3,
        },
        {
          definitionId: 'cbr-pnk.skill.coding',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.influence',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.piloting',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.ranged-combat',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.rigging',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.sciences',
          value: 0,
        },
        {
          definitionId: 'cbr-pnk.skill.streetwise',
          value: 1,
        },
        {
          definitionId: 'cbr-pnk.skill.attune',
          value: 0,
        },
      ],
      expertiseSuggestions: [
        {
          skillId: 'cbr-pnk.skill.close-combat',
          options: ['Katana', 'Monofilament whip'],
          choose: 1,
        },
      ],
      notes: [],
    },
  ],
} satisfies CharacterCatalogue
