// Display text transcribed from the supplied runner-sheet image, not new mechanics.
export const cbrPnkApproachLabels: Record<string, { description: string; glitch: string }> = {
  aggressive: { description: 'Force · Intimidation · Destruction', glitch: 'Hesitation' },
  smart: { description: 'Creativity · Cunning · Perception', glitch: 'Disorientation' },
  empathic: { description: 'Charisma · Leadership · Diplomacy', glitch: 'Apathy' },
  stealthy: { description: 'Discretion · Subterfuge · Secrecy', glitch: 'Recklessness' },
}

// Transcribed from the supplied Stress card.
export const cbrPnkStressComplications = [
  'You are taken out of action.',
  'You expose the team’s weakness.',
  'You make the team lose an advantage.',
  'You damage or overlook something crucial.',
]
