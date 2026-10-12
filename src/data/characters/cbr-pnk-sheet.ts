// Display text transcribed from the supplied runner-sheet image, not new mechanics.
export const cbrPnkAngles = [
  'Get out', 'Upgrade life',
  'Make them pay', 'Learn the truth',
  'Look after them', 'Take a stand',
]

export const cbrPnkApproachLabels: Record<string, { description: string; glitch: string }> = {
  aggressive: { description: 'Force · Intimidation · Destruction', glitch: 'Hesitation' },
  smart: { description: 'Creativity · Cunning · Perception', glitch: 'Disorientation' },
  empathic: { description: 'Charisma · Leadership · Diplomacy', glitch: 'Apathy' },
  stealthy: { description: 'Discretion · Subterfuge · Secrecy', glitch: 'Recklessness' },
}

// Preset choices transcribed from the supplied Skills card.
export const cbrPnkExpertiseOptions: Record<string, string[]> = {
  analyze: ['People', 'Situation', 'Information'],
  athletics: ['Sprint', 'Parkour', 'Swim', 'Climb'],
  'close-combat': ['Brawling', 'Weapon'],
  coding: ['Hack', 'Compile', 'Mine', 'Scramble'],
  influence: ['Perform', 'Negotiate', 'Intimidate'],
  piloting: ['Cars', 'Bikes', 'Choppers', 'Drones'],
  'ranged-combat': ['Pistol', 'Rifle', 'SMG', 'Throwing'],
  rigging: ['Electronics', 'Robotics', 'Heavy M.'],
  sciences: ['Biotech', 'Physics', 'Chemistry'],
  streetwise: ['Politics', 'Market', 'Navigation'],
  attune: ['Spirits', 'Artifacts', 'Places'],
}

// Transcribed from the supplied Stress card.
export const cbrPnkStressComplications = [
  'You are taken out of action.',
  'You expose the team’s weakness.',
  'You make the team lose an advantage.',
  'You damage or overlook something crucial.',
]

// Match imported profile wording to the existing Skills card choices.
export const cbrPnkExpertiseAliases: Record<string, Record<string, string>> = {
  coding: { Hacking: 'Hack' },
  piloting: { Motorcycles: 'Bikes' },
  analyze: { Situations: 'Situation' },
  'close-combat': { Katana: 'Weapon', 'Monofilament whip': 'Weapon' },
}

// Labels and load costs transcribed from the supplied Load/Gear card.
export const cbrPnkLoadLevels = [
  { value: 'light', label: 'Light [3]', load: 3, description: 'Move freely, blend in easily.' },
  { value: 'medium', label: 'Medium [5]', load: 5, description: 'Look ready for a job.' },
  { value: 'heavy', label: 'Heavy [7]', load: 7, description: 'Loud or slow, very conspicuous.' },
] as const

export const cbrPnkGearColumns = [
  [
    { name: 'A blade or two', load: 1 },
    { name: 'Sidearm', load: 1 },
    { name: 'Submachine gun', load: 1 },
    { name: 'Large/heavy weapon', load: 2 },
    { name: 'Tracking device', load: 1 },
    { name: 'Cyberdeck', load: 1 },
    { name: 'Small drone', load: 1, description: 'Stealthy or swift' },
    { name: 'Medium drone', load: 2, description: 'Tough or offensive' },
    { name: 'Spare battery', load: 1 },
    { name: 'Medkit', load: 1 },
    { name: 'Disguise or camo', load: 1 },
  ],
  [
    { name: 'Armor', load: 1 },
    { name: '+Heavy', load: 2 },
    { name: 'Infiltration gear', load: 1 },
    { name: 'Extra ammo', load: 1, description: 'Standard / Piercing · Explosive / Incendiary' },
    { name: 'Survival kit', load: 1, description: 'Mask, ration, water/air purif.' },
    { name: 'Grenades', load: 1, description: 'EMP / Gas / Stun / Incend. / Frag.' },
    { name: 'Demolition tools', load: 2 },
    { name: 'Microtronics tools', load: 1 },
    { name: 'Spare parts', load: 1 },
  ],
]
