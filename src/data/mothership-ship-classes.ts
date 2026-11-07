export type MothershipShipClassId = '0' | 'I' | 'II' | 'III' | 'IV' | 'V'

interface MothershipShipClass {
  id: MothershipShipClassId
  description: string
  examples: readonly string[]
}

// Class descriptions and examples transcribed from the user-supplied Ship Class table.
export const mothershipShipClasses: readonly MothershipShipClass[] = [
  { id: '0', description: 'Shuttlecraft', examples: ['Shuttle', 'Fighter', 'Dropship'] },
  { id: 'I', description: 'Light commercial', examples: ['Raider', 'Executive Transport'] },
  { id: 'II', description: 'Medium commercial', examples: ['Freighter', 'Patrol Craft'] },
  { id: 'III', description: 'Heavy commercial', examples: ['Salvage Cutter', 'Jumpliner'] },
  { id: 'IV', description: 'Light military', examples: ['Corvette'] },
  { id: 'V', description: 'Medium military', examples: ['Exploration Vessel', 'Troopship'] },
]
