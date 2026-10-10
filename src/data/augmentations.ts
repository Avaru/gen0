import type { RawBit } from '@/builders/types'

export const augmentationAttributes: RawBit[] = [
  'Aftermarket',
  'High-tech',
  'Stolen',
  'Malfunctioning',
  'Expensive',
  'High-class',
  'Low-class',
  'Outdated',
  'Glitched',
  'Mass-produced',
  'Customized',
  'Waterproof',
  'Corporate',
  'Jury-rigged',
  'Prototype',
  'Discontinued',
  '2nd hand',
  'Iconic',
].map((value) => ({ value, tags: [] }))

// Concepts from the CBR+PNK, CP 2077, and Shadowrun lists discussed for this category.
// Only obscure names need descriptions; these summarize purpose, not game effects.
export const augmentationData: RawBit<'kind'>[] = [
  {
    id: 'racing-legs',
    value: 'Racing legs',
    tags: [],
  },
  {
    id: 'reflexes',
    value: 'Wired reflexes',
    tags: [],
  },
  {
    id: 'thermal-vision',
    value: 'Thermal vision',
    flavorNames: { shadowrun: 'Thermographic vision', 'cyberpunk2020-2077': 'Thermal vision' },
    tags: [],
  },
  {
    id: 'strength',
    value: 'Augmented strength',
    tags: [],
  },
  {
    id: 'blade',
    value: 'Concealed blade',
    tags: [],
  },
  {
    id: 'chemicals',
    value: 'Chemical reservoir',
    tags: [],
  },
  {
    id: 'nanobots',
    value: 'Nanobot reservoir',
    tags: [],
  },
  {
    id: 'firewall',
    value: 'Neural firewall',
    tags: [],
  },
  {
    id: 'behavior',
    value: 'Behavioral analyzer',
    tags: [],
  },
  {
    id: 'toxins',
    value: 'Toxin neutralizer',
    tags: [],
  },
  {
    id: 'fireproof',
    value: 'Fireproof coating',
    tags: [],
  },
  {
    id: 'cybereyes',
    value: 'Cybereyes',
    tags: [],
  },
  {
    id: 'smartlink',
    value: 'Smart targeting link',
    flavorNames: { shadowrun: 'Smartlink', 'cyberpunk2020-2077': 'Smart Link' },
    details: 'Connects compatible weapons to an implanted targeting display.',
    tags: [],
  },
  {
    id: 'armor',
    value: 'Subdermal armor',
    flavorNames: { shadowrun: 'Dermal plating' },
    tags: [],
  },
  {
    id: 'mantis-blades',
    value: 'Mantis Blades',
    tags: [],
  },
  {
    id: 'gorilla-arms',
    value: 'Gorilla Arms',
    tags: [],
  },
  {
    id: 'monowire',
    value: 'Monowire',
    details: 'A concealed cutting wire deploys from the arm.',
    tags: [],
  },
  {
    id: 'projectile-launcher',
    value: 'Projectile Launch System',
    tags: [],
  },
  {
    id: 'kiroshi-optics',
    value: 'Kiroshi Optics',
    tags: [],
  },
  {
    id: 'ballistic-coprocessor',
    value: 'Ballistic Coprocessor',
    details: 'Assists with aiming ricochet shots.',
    tags: [],
  },
  {
    id: 'sandevistan',
    value: 'Sandevistan',
    details: 'Accelerates reactions so the surrounding world seems slower.',
    tags: [],
  },
  {
    id: 'kerenzikov',
    value: 'Kerenzikov',
    details: 'Provides brief bursts of accelerated perception.',
    tags: [],
  },
  {
    id: 'berserk',
    value: 'Berserk',
    details: 'Temporarily enhances the body for intense close combat.',
    tags: [],
  },
  {
    id: 'cyberdeck',
    value: 'Implanted cyberdeck',
    tags: [],
  },
  {
    id: 'camo',
    value: 'Optical camo',
    tags: [],
  },
  {
    id: 'tendons',
    value: 'Reinforced Tendons',
    details: 'Enhanced leg systems enable a second jump in midair.',
    tags: [],
  },
  {
    id: 'ankles',
    value: 'Fortified Ankles',
    tags: [],
  },
  {
    id: 'lynx-paws',
    value: 'Lynx Paws',
    details: 'Leg enhancements dampen movement noise.',
    tags: [],
  },
  {
    id: 'blood-pump',
    value: 'Blood Pump',
    details: 'An implanted pump delivers emergency healing support.',
    tags: [],
  },
  {
    id: 'biomonitor',
    value: 'Biomonitor',
    tags: [],
  },
  {
    id: 'second-heart',
    value: 'Second Heart',
    details: 'An emergency cardiac system revives the user after collapse.',
    tags: [],
  },
  {
    id: 'bone-lacing',
    value: 'Reinforced bones',
    flavorNames: { shadowrun: 'Bone lacing', 'cyberpunk2020-2077': 'Titanium Bones' },
    tags: [],
  },
  {
    id: 'microrotors',
    value: 'Microrotors',
    details: 'Small actuators accelerate melee movements.',
    tags: [],
  },
  {
    id: 'syn-lungs',
    value: 'Syn-Lungs',
    tags: [],
  },
  {
    id: 'datajack',
    value: 'Datajack',
    tags: [],
  },
  {
    id: 'control-rig',
    value: 'Control rig',
    details: 'A neural interface allows direct control of vehicles and drones.',
    tags: [],
  },
  {
    id: 'cyberjack',
    value: 'Cyberjack',
    details: 'An advanced neural interface supports full immersion in the Matrix.',
    tags: [],
  },
  {
    id: 'commlink',
    value: 'Implanted communicator',
    flavorNames: { shadowrun: 'Implanted commlink' },
    tags: [],
  },
  {
    id: 'low-light',
    value: 'Low-light vision',
    tags: [],
  },
  {
    id: 'magnification',
    value: 'Vision magnification',
    tags: [],
  },
  {
    id: 'flare',
    value: 'Flare compensation',
    tags: [],
  },
  {
    id: 'cyberears',
    value: 'Cyberears',
    tags: [],
  },
  {
    id: 'sound-filter',
    value: 'Sound filter',
    tags: [],
  },
  {
    id: 'reaction',
    value: 'Reaction enhancers',
    tags: [],
  },
  {
    id: 'muscle-replacement',
    value: 'Muscle replacement',
    tags: [],
  },
  {
    id: 'cyberarm',
    value: 'Cyberarm',
    tags: [],
  },
  {
    id: 'cyberleg',
    value: 'Cyberleg',
    tags: [],
  },
  {
    id: 'hand-razors',
    value: 'Hand razors',
    tags: [],
  },
  {
    id: 'spurs',
    value: 'Spurs',
    details: 'Implanted stabbing blades deploy for close combat.',
    tags: [],
  },
  {
    id: 'compartment',
    value: 'Fingertip compartment',
    tags: [],
  },
  {
    id: 'voice',
    value: 'Voice modulator',
    tags: [],
  },
  {
    id: 'skillwires',
    value: 'Skillwires',
    details: 'Neural and muscular interfaces execute downloaded physical skills.',
    tags: [],
  },
  {
    id: 'simrig',
    value: 'Simrig',
    details: 'Records sensory experiences for later playback.',
    tags: [],
  },
  {
    id: 'air-tank',
    value: 'Internal air tank',
    tags: [],
  },
  {
    id: 'olfactory',
    value: 'Olfactory booster',
    tags: [],
  },
  {
    id: 'analyzer',
    value: 'Chemical analyzer',
    tags: [],
  },
].map((entry) => ({ ...entry, type: 'kind' }))

// Reuse available company entries. Products are fictional combinations, not canon models.
export const augmentationManufacturers = [
  'Kiroshi',
  'Arasaka',
  'Militech',
  'Biotechnica',
  'Raven Microcybernetics',
  'Dynalar',
  'Zetatech',
  'Shiawase',
  'Renraku',
  'Aztechnology',
  'Saeder-Krupp',
  'Ares',
  'Ares Macrotechnology',
  'Universal Omnitech',
]
