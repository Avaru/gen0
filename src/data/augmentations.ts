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
    value: 'Racing legs',
    tags: [],
  },
  {
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
    value: 'Augmented strength',
    tags: [],
  },
  {
    value: 'Concealed blade',
    tags: [],
  },
  {
    value: 'Chemical reservoir',
    tags: [],
  },
  {
    value: 'Nanobot reservoir',
    tags: [],
  },
  {
    value: 'Neural firewall',
    tags: [],
  },
  {
    value: 'Behavioral analyzer',
    tags: [],
  },
  {
    value: 'Toxin neutralizer',
    tags: [],
  },
  {
    value: 'Fireproof coating',
    tags: [],
  },
  {
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
    value: 'Mantis Blades',
    tags: [],
  },
  {
    value: 'Gorilla Arms',
    tags: [],
  },
  {
    value: 'Monowire',
    details: 'A concealed cutting wire deploys from the arm.',
    tags: [],
  },
  {
    value: 'Projectile Launch System',
    tags: [],
  },
  {
    id: 'kiroshi-optics',
    value: 'Kiroshi Optics',
    tags: [],
  },
  {
    value: 'Ballistic Coprocessor',
    details: 'Assists with aiming ricochet shots.',
    tags: [],
  },
  {
    value: 'Sandevistan',
    details: 'Accelerates reactions so the surrounding world seems slower.',
    tags: [],
  },
  {
    value: 'Kerenzikov',
    details: 'Provides brief bursts of accelerated perception.',
    tags: [],
  },
  {
    value: 'Berserk',
    details: 'Temporarily enhances the body for intense close combat.',
    tags: [],
  },
  {
    value: 'Implanted cyberdeck',
    tags: [],
  },
  {
    value: 'Optical camo',
    tags: [],
  },
  {
    value: 'Reinforced Tendons',
    details: 'Enhanced leg systems enable a second jump in midair.',
    tags: [],
  },
  {
    value: 'Fortified Ankles',
    tags: [],
  },
  {
    value: 'Lynx Paws',
    details: 'Leg enhancements dampen movement noise.',
    tags: [],
  },
  {
    value: 'Blood Pump',
    details: 'An implanted pump delivers emergency healing support.',
    tags: [],
  },
  {
    value: 'Biomonitor',
    tags: [],
  },
  {
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
    value: 'Microrotors',
    details: 'Small actuators accelerate melee movements.',
    tags: [],
  },
  {
    value: 'Syn-Lungs',
    tags: [],
  },
  {
    value: 'Datajack',
    tags: [],
  },
  {
    value: 'Control rig',
    details: 'A neural interface allows direct control of vehicles and drones.',
    tags: [],
  },
  {
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
    value: 'Low-light vision',
    tags: [],
  },
  {
    value: 'Vision magnification',
    tags: [],
  },
  {
    value: 'Flare compensation',
    tags: [],
  },
  {
    value: 'Cyberears',
    tags: [],
  },
  {
    value: 'Sound filter',
    tags: [],
  },
  {
    value: 'Reaction enhancers',
    tags: [],
  },
  {
    value: 'Muscle replacement',
    tags: [],
  },
  {
    value: 'Cyberarm',
    tags: [],
  },
  {
    value: 'Cyberleg',
    tags: [],
  },
  {
    value: 'Hand razors',
    tags: [],
  },
  {
    value: 'Spurs',
    details: 'Implanted stabbing blades deploy for close combat.',
    tags: [],
  },
  {
    value: 'Fingertip compartment',
    tags: [],
  },
  {
    value: 'Voice modulator',
    tags: [],
  },
  {
    value: 'Skillwires',
    details: 'Neural and muscular interfaces execute downloaded physical skills.',
    tags: [],
  },
  {
    value: 'Simrig',
    details: 'Records sensory experiences for later playback.',
    tags: [],
  },
  {
    value: 'Internal air tank',
    tags: [],
  },
  {
    value: 'Olfactory booster',
    tags: [],
  },
  {
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
