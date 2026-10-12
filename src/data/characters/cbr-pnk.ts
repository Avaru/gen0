import type { CharacterCatalogue } from './types'

// Migrated from character-generator-model.zip; source values and IDs are unchanged.
export const cbrPnkCatalogue = {
  schemaVersion: 1,
  sources: [
    {
      id: 'conversation-build-list',
      title: 'CBR+PNK Character Creation Aid by Jonathan Loy \u2014 conversation extraction',
      url: 'https://www.scribd.com/document/871960255/CBR-PNK-Character-Creation-Aid',
      note: 'Seeded from the values already displayed in this conversation; not independently checked against original PDF pages. Generic mappings and capability categories are design choices.',
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
  systemModules: [
    {
      id: 'cbr-pnk.core',
      systemId: 'cbr-pnk',
      name: 'Core',
      defaultEnabled: true,
    },
    {
      id: 'cbr-pnk.weird',
      systemId: 'cbr-pnk',
      name: 'Weird',
      defaultEnabled: false,
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
      suggestedAugmentationIds: ['biochip', 'resuscitation-implant', 'adrenal-booster'],
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
      suggestedAugmentationIds: ['wired-reflexes', 'av-effects-suite'],
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
      suggestedAugmentationIds: ['vocal-synthesizer'],
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
      suggestedAugmentationIds: ['multitool-hand', 'power-legs'],
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
      suggestedAugmentationIds: ['wired-reflexes'],
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
      suggestedAugmentationIds: [],
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
      suggestedAugmentationIds: ['visual-enhancers', 'remote-firing-controls'],
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
      suggestedAugmentationIds: ['multitool-hand', 'prehensile-tail'],
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
      suggestedAugmentationIds: ['subdermal-armor'],
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
      suggestedAugmentationIds: [],
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
      suggestedAugmentationIds: [],
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
      suggestedAugmentationIds: ['retractable-razor-claws', 'cybernetic-eyes', 'wired-reflexes'],
      notes: [],
    },
  ],
  augmentationCategories: [
    {
      id: 'agility',
      name: 'Agility',
      description: 'Reflexes, coordination, and quick movement.',
    },
    {
      id: 'strength',
      name: 'Strength',
      description: 'Physical power and load-bearing capability.',
    },
    {
      id: 'mobility',
      name: 'Mobility',
      description: 'Traversal and movement options.',
    },
    {
      id: 'perception',
      name: 'Perception',
      description: 'Sensory enhancement and remote observation.',
    },
    {
      id: 'communication',
      name: 'Communication',
      description: 'Voice, messaging, and data exchange.',
    },
    {
      id: 'negotiation',
      name: 'Negotiation',
      description: 'Social influence and interpersonal leverage.',
    },
    {
      id: 'hacking',
      name: 'Hacking',
      description: 'Computer access and digital intrusion.',
    },
    {
      id: 'device-control',
      name: 'Device control',
      description: 'Remote control of drones, machines, or weapons.',
    },
    {
      id: 'stealth',
      name: 'Stealth',
      description: 'Concealment, disguise, and identity masking.',
    },
    {
      id: 'combat',
      name: 'Combat',
      description: 'Weapons and offensive capability.',
    },
    {
      id: 'resilience',
      name: 'Resilience',
      description: 'Protection, survival, and recovery.',
    },
    {
      id: 'analysis',
      name: 'Analysis',
      description: 'Scientific sensing, diagnostics, and information processing.',
    },
    {
      id: 'engineering',
      name: 'Engineering',
      description: 'Tools, repair, and physical technical work.',
    },
  ],
  augmentations: [
    {
      id: 'biochip',
      name: 'Biochip',
      categoryIds: ['hacking', 'analysis'],
      categorizationBasis: 'inferred-from-name',
      notes: ['Capabilities unspecified; chip functionality depends on its implementation.'],
    },
    {
      id: 'resuscitation-implant',
      name: 'Resuscitation implant',
      categoryIds: ['resilience'],
      categorizationBasis: 'inferred-from-name',
      notes: [],
    },
    {
      id: 'adrenal-booster',
      name: 'Adrenal booster',
      categoryIds: ['agility'],
      categorizationBasis: 'inferred-from-name',
      notes: ['Strength enhancement is not established by the source name.'],
    },
    {
      id: 'wired-reflexes',
      name: 'Wired reflexes',
      categoryIds: ['agility'],
      categorizationBasis: 'inferred-from-name',
      notes: [],
    },
    {
      id: 'av-effects-suite',
      name: 'A/V effects suite',
      categoryIds: ['communication'],
      categorizationBasis: 'inferred-from-name',
      notes: ['Effect suite functionality is unspecified; social benefits are not established.'],
    },
    {
      id: 'vocal-synthesizer',
      name: 'Vocal synthesizer',
      categoryIds: ['communication'],
      categorizationBasis: 'inferred-from-name',
      notes: ['Voice features do not automatically provide negotiation benefits.'],
    },
    {
      id: 'multitool-hand',
      name: 'Multitool hand',
      categoryIds: ['engineering'],
      categorizationBasis: 'inferred-from-name',
      notes: [],
    },
    {
      id: 'power-legs',
      name: 'Power legs',
      categoryIds: ['mobility', 'strength'],
      categorizationBasis: 'inferred-from-name',
      notes: [],
    },
    {
      id: 'visual-enhancers',
      name: 'Visual enhancers',
      categoryIds: ['perception'],
      categorizationBasis: 'inferred-from-name',
      notes: [],
    },
    {
      id: 'remote-firing-controls',
      name: 'Remote firing controls',
      categoryIds: ['device-control', 'combat'],
      categorizationBasis: 'inferred-from-name',
      notes: [],
    },
    {
      id: 'ocular-drone',
      name: 'Ocular drone',
      categoryIds: ['perception', 'device-control'],
      categorizationBasis: 'inferred-from-name',
      notes: [],
    },
    {
      id: 'chemical-analyzer',
      name: 'Chemical analyzer',
      categoryIds: ['analysis'],
      categorizationBasis: 'inferred-from-name',
      notes: [],
    },
    {
      id: 'sonar-implant',
      name: 'Sonar implant',
      categoryIds: ['perception'],
      categorizationBasis: 'inferred-from-name',
      notes: [],
    },
    {
      id: 'drone-control-implant',
      name: 'Drone control implant',
      categoryIds: ['device-control'],
      categorizationBasis: 'inferred-from-name',
      notes: [],
    },
    {
      id: 'kill-switch-implant',
      name: 'Kill switch implant',
      categoryIds: ['device-control'],
      categorizationBasis: 'inferred-from-name',
      notes: ['Target, operation, and combat utility are unspecified.'],
    },
    {
      id: 'subdermal-armor',
      name: 'Subdermal armor',
      categoryIds: ['resilience'],
      categorizationBasis: 'inferred-from-name',
      notes: [],
    },
    {
      id: 'retractable-razor-claws',
      name: 'Retractable razor claws',
      categoryIds: ['combat'],
      categorizationBasis: 'inferred-from-name',
      notes: [],
    },
    {
      id: 'cybernetic-eyes',
      name: 'Cybernetic eyes',
      categoryIds: ['perception'],
      categorizationBasis: 'inferred-from-name',
      notes: ['Specific sensory modes are unspecified.'],
    },
    {
      id: 'appearance-scrambler',
      name: 'Appearance scrambler',
      categoryIds: ['stealth'],
      categorizationBasis: 'inferred-from-name',
      notes: [],
    },
    {
      id: 'toxin-fangs',
      name: 'Toxin fangs',
      categoryIds: ['combat'],
      categorizationBasis: 'inferred-from-name',
      notes: [],
    },
    {
      id: 'pheromone-excretor',
      name: 'Pheromone excretor',
      categoryIds: ['negotiation'],
      categorizationBasis: 'inferred-from-name',
      notes: ['Social-use classification is an inference, not a mechanical effect.'],
    },
    {
      id: 'wireless-datajack',
      name: 'Wireless datajack',
      categoryIds: ['communication', 'hacking'],
      categorizationBasis: 'inferred-from-name',
      notes: [],
    },
    {
      id: 'prehensile-tail',
      name: 'Prehensile tail',
      categoryIds: ['mobility'],
      categorizationBasis: 'inferred-from-name',
      notes: ['Traversal utility is inferred; strength or agility bonuses are not established.'],
    },
  ],
  augmentationSystemBindings: [
    {
      augmentationId: 'biochip',
      systemId: 'cbr-pnk',
      name: 'Datatek Biochip',
      requiredModuleIds: ['cbr-pnk.core'],
    },
    {
      augmentationId: 'biochip',
      systemId: 'cbr-pnk',
      name: 'Ivaldi & Sons Biochip',
      requiredModuleIds: ['cbr-pnk.core'],
    },
    {
      augmentationId: 'resuscitation-implant',
      systemId: 'cbr-pnk',
      name: 'Medisafe Resuscitation Implant',
      requiredModuleIds: ['cbr-pnk.core'],
    },
    {
      augmentationId: 'adrenal-booster',
      systemId: 'cbr-pnk',
      name: 'Mercedes Adrenal Booster',
      requiredModuleIds: ['cbr-pnk.core'],
    },
    {
      augmentationId: 'wired-reflexes',
      systemId: 'cbr-pnk',
      name: 'Helios Wired Reflexes',
      requiredModuleIds: ['cbr-pnk.core'],
    },
    {
      augmentationId: 'av-effects-suite',
      systemId: 'cbr-pnk',
      name: 'Mercury A/V Effects Suite',
      requiredModuleIds: ['cbr-pnk.core'],
    },
    {
      augmentationId: 'vocal-synthesizer',
      systemId: 'cbr-pnk',
      name: 'BlueWave Vocal Synthesizer',
      requiredModuleIds: ['cbr-pnk.core'],
    },
    {
      augmentationId: 'multitool-hand',
      systemId: 'cbr-pnk',
      name: 'Weyland Multitool Robotic Hand',
      requiredModuleIds: ['cbr-pnk.core'],
    },
    {
      augmentationId: 'multitool-hand',
      systemId: 'cbr-pnk',
      name: 'Caliburn Robotic Hand with Multitool Attachment',
      requiredModuleIds: ['cbr-pnk.core'],
    },
    {
      augmentationId: 'power-legs',
      systemId: 'cbr-pnk',
      name: 'Vulcan Dynamics Power Legs',
      requiredModuleIds: ['cbr-pnk.core'],
    },
    {
      augmentationId: 'visual-enhancers',
      systemId: 'cbr-pnk',
      name: 'Knoll Visual Enhancers',
      requiredModuleIds: ['cbr-pnk.core'],
    },
    {
      augmentationId: 'remote-firing-controls',
      systemId: 'cbr-pnk',
      name: 'Paddington Arms Remote Firing Controls',
      requiredModuleIds: ['cbr-pnk.core'],
    },
    {
      augmentationId: 'ocular-drone',
      systemId: 'cbr-pnk',
      name: 'Cairo Ltd. Ocular Drone',
      requiredModuleIds: ['cbr-pnk.core'],
    },
    {
      augmentationId: 'chemical-analyzer',
      systemId: 'cbr-pnk',
      name: 'Medisafe Chemical Analyzer',
      requiredModuleIds: ['cbr-pnk.core'],
    },
    {
      augmentationId: 'sonar-implant',
      systemId: 'cbr-pnk',
      name: 'Phillips Sonar Implant',
      requiredModuleIds: ['cbr-pnk.core'],
    },
    {
      augmentationId: 'drone-control-implant',
      systemId: 'cbr-pnk',
      name: 'Pratchett Drone Control Implant',
      requiredModuleIds: ['cbr-pnk.core'],
    },
    {
      augmentationId: 'kill-switch-implant',
      systemId: 'cbr-pnk',
      name: 'RobCo Kill Switch Implant',
      requiredModuleIds: ['cbr-pnk.core'],
    },
    {
      augmentationId: 'subdermal-armor',
      systemId: 'cbr-pnk',
      name: 'Subdermal Armor',
      requiredModuleIds: ['cbr-pnk.core'],
    },
    {
      augmentationId: 'retractable-razor-claws',
      systemId: 'cbr-pnk',
      name: 'Yamato Retractable Razor Claws',
      requiredModuleIds: ['cbr-pnk.core'],
    },
    {
      augmentationId: 'cybernetic-eyes',
      systemId: 'cbr-pnk',
      name: 'Sanwa Cybernetic Eyes',
      requiredModuleIds: ['cbr-pnk.core'],
    },
    {
      augmentationId: 'appearance-scrambler',
      systemId: 'cbr-pnk',
      name: 'Pangu Appearance Scrambler',
      requiredModuleIds: ['cbr-pnk.core'],
    },
    {
      augmentationId: 'toxin-fangs',
      systemId: 'cbr-pnk',
      name: 'BioSystems Toxin Fangs',
      requiredModuleIds: ['cbr-pnk.core'],
    },
    {
      augmentationId: 'pheromone-excretor',
      systemId: 'cbr-pnk',
      name: 'Red Sun Pheromone Excretor',
      requiredModuleIds: ['cbr-pnk.core'],
    },
    {
      augmentationId: 'wireless-datajack',
      systemId: 'cbr-pnk',
      name: 'Saturn Digital Wireless Datajack',
      requiredModuleIds: ['cbr-pnk.core'],
    },
    {
      augmentationId: 'prehensile-tail',
      systemId: 'cbr-pnk',
      name: 'Tenjin Prehensile Tail',
      requiredModuleIds: ['cbr-pnk.core'],
    },
  ],
  flavors: [],
  flavorArchetypes: [],
  flavorAugmentations: [],
  unmappedArchetypes: [
    {
      archetypeId: 'mage',
      systemId: 'cbr-pnk',
      reason: 'No Mage build in the supplied source list; no profile or ratings seeded.',
    },
  ],
  flavorSystems: [],
} satisfies CharacterCatalogue
