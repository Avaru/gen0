import type { RawBit } from '@/builders/types'
import type { Archetype } from '@/data/characters/types'

export type AugmentationBit = RawBit<'kind'> & { archetypeIds: Archetype['id'][] }

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
// Archetype links are editable suitability matches inferred from purpose, not game rules.
// Character archetype selection picks one linked entry; standalone generation keeps the full pool.
export const augmentationData: AugmentationBit[] = [
  {
    value: 'Racing legs',
    archetypeIds: ['driver', 'infiltrator'],
    tags: [],
  },
  {
    value: 'Wired reflexes',
    archetypeIds: ['driver', 'infiltrator', 'street-samurai'],
    tags: [],
  },
  {
    id: 'thermal-vision',
    value: 'Thermal vision',
    archetypeIds: ['marksman', 'infiltrator', 'analyst', 'street-samurai'],
    flavorNames: { shadowrun: 'Thermographic vision', 'cyberpunk2020-2077': 'Thermal vision' },
    tags: [],
  },
  {
    value: 'Augmented strength',
    archetypeIds: ['brawler', 'street-samurai'],
    tags: [],
  },
  {
    value: 'Concealed blade',
    archetypeIds: ['brawler', 'street-samurai', 'infiltrator'],
    tags: [],
  },
  {
    value: 'Chemical reservoir',
    archetypeIds: ['scientist'],
    tags: [],
  },
  {
    value: 'Nanobot reservoir',
    archetypeIds: ['scientist'],
    tags: [],
  },
  {
    value: 'Neural firewall',
    archetypeIds: ['hacker'],
    tags: [],
  },
  {
    value: 'Behavioral analyzer',
    archetypeIds: ['face', 'analyst'],
    tags: [],
  },
  {
    value: 'Toxin neutralizer',
    archetypeIds: ['brawler', 'street-samurai'],
    tags: [],
  },
  {
    value: 'Fireproof coating',
    archetypeIds: ['brawler', 'street-samurai'],
    tags: [],
  },
  {
    value: 'Cybereyes',
    archetypeIds: ['marksman', 'infiltrator', 'analyst', 'street-samurai'],
    tags: [],
  },
  {
    id: 'smartlink',
    value: 'Smart targeting link',
    archetypeIds: ['marksman', 'street-samurai'],
    flavorNames: { shadowrun: 'Smartlink', 'cyberpunk2020-2077': 'Smart Link' },
    details: 'Connects compatible weapons to an implanted targeting display.',
    tags: [],
  },
  {
    id: 'armor',
    value: 'Subdermal armor',
    archetypeIds: ['brawler', 'street-samurai'],
    flavorNames: { shadowrun: 'Dermal plating' },
    tags: [],
  },
  {
    value: 'Mantis Blades',
    archetypeIds: ['brawler', 'street-samurai', 'infiltrator'],
    tags: [],
  },
  {
    value: 'Gorilla Arms',
    archetypeIds: ['brawler', 'street-samurai'],
    tags: [],
  },
  {
    value: 'Monowire',
    archetypeIds: ['brawler', 'street-samurai', 'infiltrator'],
    details: 'A concealed cutting wire deploys from the arm.',
    tags: [],
  },
  {
    value: 'Projectile Launch System',
    archetypeIds: ['marksman', 'street-samurai'],
    tags: [],
  },
  {
    id: 'kiroshi-optics',
    value: 'Kiroshi Optics',
    archetypeIds: ['marksman', 'infiltrator', 'analyst', 'street-samurai'],
    tags: [],
  },
  {
    value: 'Ballistic Coprocessor',
    archetypeIds: ['marksman', 'street-samurai'],
    details: 'Assists with aiming ricochet shots.',
    tags: [],
  },
  {
    value: 'Sandevistan',
    archetypeIds: ['brawler', 'marksman', 'street-samurai'],
    details: 'Accelerates reactions so the surrounding world seems slower.',
    tags: [],
  },
  {
    value: 'Kerenzikov',
    archetypeIds: ['driver', 'marksman', 'street-samurai'],
    details: 'Provides brief bursts of accelerated perception.',
    tags: [],
  },
  {
    value: 'Berserk',
    archetypeIds: ['brawler', 'street-samurai'],
    details: 'Temporarily enhances the body for intense close combat.',
    tags: [],
  },
  {
    value: 'Implanted cyberdeck',
    archetypeIds: ['hacker'],
    tags: [],
  },
  {
    value: 'Optical camo',
    archetypeIds: ['infiltrator'],
    tags: [],
  },
  {
    value: 'Reinforced Tendons',
    archetypeIds: ['infiltrator', 'brawler'],
    details: 'Enhanced leg systems enable a second jump in midair.',
    tags: [],
  },
  {
    value: 'Fortified Ankles',
    archetypeIds: ['infiltrator', 'brawler'],
    tags: [],
  },
  {
    value: 'Lynx Paws',
    archetypeIds: ['infiltrator'],
    details: 'Leg enhancements dampen movement noise.',
    tags: [],
  },
  {
    value: 'Blood Pump',
    archetypeIds: ['brawler', 'street-samurai'],
    details: 'An implanted pump delivers emergency healing support.',
    tags: [],
  },
  {
    value: 'Biomonitor',
    archetypeIds: ['brawler', 'street-samurai'],
    tags: [],
  },
  {
    value: 'Second Heart',
    archetypeIds: ['brawler', 'street-samurai'],
    details: 'An emergency cardiac system revives the user after collapse.',
    tags: [],
  },
  {
    id: 'bone-lacing',
    value: 'Reinforced bones',
    archetypeIds: ['brawler', 'street-samurai'],
    flavorNames: { shadowrun: 'Bone lacing', 'cyberpunk2020-2077': 'Titanium Bones' },
    tags: [],
  },
  {
    value: 'Microrotors',
    archetypeIds: ['brawler', 'street-samurai'],
    details: 'Small actuators accelerate melee movements.',
    tags: [],
  },
  {
    value: 'Syn-Lungs',
    archetypeIds: ['brawler', 'street-samurai'],
    tags: [],
  },
  {
    value: 'Datajack',
    archetypeIds: ['hacker'],
    tags: [],
  },
  {
    value: 'Control rig',
    archetypeIds: ['driver', 'rigger'],
    details: 'A neural interface allows direct control of vehicles and drones.',
    tags: [],
  },
  {
    value: 'Cyberjack',
    archetypeIds: ['hacker'],
    details: 'An advanced neural interface supports full immersion in the Matrix.',
    tags: [],
  },
  {
    id: 'commlink',
    value: 'Implanted communicator',
    archetypeIds: ['face', 'hacker', 'rigger', 'analyst'],
    flavorNames: { shadowrun: 'Implanted commlink' },
    tags: [],
  },
  {
    value: 'Low-light vision',
    archetypeIds: ['marksman', 'infiltrator', 'analyst', 'street-samurai'],
    tags: [],
  },
  {
    value: 'Vision magnification',
    archetypeIds: ['marksman', 'analyst', 'driver'],
    tags: [],
  },
  {
    value: 'Flare compensation',
    archetypeIds: ['marksman', 'analyst', 'driver'],
    tags: [],
  },
  {
    value: 'Cyberears',
    archetypeIds: ['analyst', 'infiltrator'],
    tags: [],
  },
  {
    value: 'Sound filter',
    archetypeIds: ['analyst', 'infiltrator'],
    tags: [],
  },
  {
    value: 'Reaction enhancers',
    archetypeIds: ['driver', 'marksman', 'street-samurai'],
    tags: [],
  },
  {
    value: 'Muscle replacement',
    archetypeIds: ['brawler', 'street-samurai'],
    tags: [],
  },
  {
    value: 'Cyberarm',
    archetypeIds: ['brawler', 'street-samurai'],
    tags: [],
  },
  {
    value: 'Cyberleg',
    archetypeIds: ['infiltrator', 'brawler'],
    tags: [],
  },
  {
    value: 'Hand razors',
    archetypeIds: ['brawler', 'street-samurai', 'infiltrator'],
    tags: [],
  },
  {
    value: 'Spurs',
    archetypeIds: ['brawler', 'street-samurai', 'infiltrator'],
    details: 'Implanted stabbing blades deploy for close combat.',
    tags: [],
  },
  {
    value: 'Fingertip compartment',
    archetypeIds: ['infiltrator', 'face'],
    tags: [],
  },
  {
    value: 'Voice modulator',
    archetypeIds: ['face', 'infiltrator'],
    tags: [],
  },
  {
    value: 'Skillwires',
    archetypeIds: ['brawler', 'infiltrator', 'driver'],
    details: 'Neural and muscular interfaces execute downloaded physical skills.',
    tags: [],
  },
  {
    value: 'Simrig',
    archetypeIds: ['analyst', 'face'],
    details: 'Records sensory experiences for later playback.',
    tags: [],
  },
  {
    value: 'Internal air tank',
    archetypeIds: ['brawler', 'street-samurai'],
    tags: [],
  },
  {
    value: 'Olfactory booster',
    archetypeIds: ['analyst', 'infiltrator'],
    tags: [],
  },
  {
    value: 'Chemical analyzer',
    archetypeIds: ['analyst', 'scientist'],
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
