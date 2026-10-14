import { cbrPnkCatalogue } from '@/data/characters/cbr-pnk'
import type { CharacterSheet } from '@/data/characters/types'

export function runnerImagePrompt(runner: CharacterSheet['runner']): string {
  const archetype = cbrPnkCatalogue.archetypes.find((item) => item.id === runner.archetypeId)
  const characterContext = [
    archetype
      ? `Character archetype: ${archetype.name}. Let this inform the character's visual role while respecting the description.`
      : '',
    runner.angle?.trim()
      ? `Character angle / motivation: ${runner.angle}. Express this motivation subtly through expression, posture and mood rather than literal text or symbols.`
      : '',
  ]
    .filter(Boolean)
    .join('\n')
  return `Create a square (1:1) character portrait for a cyberpunk role-playing game.

Style: bold graphic-novel illustration with a punk screen-printed poster aesthetic. Use expressive ink lines, angular shapes, broad flat colors, deep black shadows and sharply cut highlights. Use a limited palette of acid yellow (#eeff00), bright cyan (#52f4ed) and near-black charcoal (#11171b), with off-white (#f4f5e9) highlights and small coral-red (#ff6761) accents. Make yellow and cyan the dominant color accents, with charcoal providing strong contrast. Keep the background simple, using charcoal or acid yellow, and carry the same palette into the name lettering. Add subtle grain, stippling, distressed print texture and a few rough brush marks. Keep the face and silhouette striking and readable, with dramatic lighting and a confident editorial composition. Illustrate rather than render photorealistically.

Frame the character as a close-up or chest-up portrait within the square. Follow the character description for appearance, clothing, age and any cybernetics; use any background details to inform their attitude. Do not add cybernetic implants that contradict the description.

Character name / handle: ${JSON.stringify(runner.alias)}
Character description:
${runner.description}
${characterContext ? `\n${characterContext}\n` : ''}

Write the character name / handle exactly as provided in stylish, legible lettering integrated into the artwork. Choose a lettering treatment that suits this character: bold condensed poster type, rough stencil lettering, angular futuristic type, or an expressive hand-lettered punk signature. Vary the placement to suit the composition: along the top or bottom edge, in an open corner, or vertically along a side margin. Pick one combination for this portrait; different portraits can use different fonts and positions. Use negative space and keep the lettering clear of the face. The name should be the only text in the image.`
}
