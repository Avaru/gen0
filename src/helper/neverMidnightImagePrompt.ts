import type { Generated } from '@/patterns/types'

export function neverMidnightImagePrompt(character: Generated): string {
  const givenName = character.primary.trim().split(/\s+/)[0] ?? ''
  const nameTreatments = [
    'an incidental sign in the background, such as a worn street or office sign, with believable period lettering; it should feel like a chance detail of the location rather than a sign staged for the portrait',
    'a small paper or cloth name tag on their clothing, either visibly handwritten in pen with irregular strokes and spacing, or typed on a mechanical typewriter with monospaced letters, uneven ink and slight misalignment; never a clean printed badge or digital font',
  ]
  const treatmentIndex =
    Array.from(character.primary).reduce((total, letter) => total + letter.codePointAt(0)!, 0) %
    nameTreatments.length
  const description = [
    character.age ? `Age: ${character.age}` : '',
    character.appearance ? `Appearance: ${character.appearance}` : '',
    character.secondary ? `Occupation: ${character.secondary}` : '',
    character.details,
  ]
    .filter(Boolean)
    .join('\n')

  return `Create a square (1:1), highly realistic black-and-white photographic character portrait for Never Midnight, set in East Berlin in 1986.

Photographic style: an unposed-looking archival photograph from the 1980s Eastern Bloc, with natural skin texture, ordinary faces, expressive character and believable period clothing. Use visible analogue film grain, slightly soft focus, a little motion blur and imperfect exposure, while keeping the face recognizable and the name legible. The result should feel like a real, slightly blurry documentary print, with natural overcast daylight or plain direct flash. No illustration, glossy fashion photography, modern digital sharpness or color tinting.

Composition: one person in a chest-up or waist-up mugshot-inspired documentary portrait. Give them a distinct, expressive presence through a candid half-smile, skeptical glance, defiant stare, visible weariness or sudden amusement, guided by their appearance and occupation. Allow a slight turn of the head, an off-center stance, a lean against a wall or a natural hand gesture. Keep the face readable and the body language believable; avoid a stiff passport-photo pose or theatrical overacting. Follow the supplied age, appearance, clothing and occupation. Take the visual cues from everyday 1980s East Berlin documentary photography: worn brick courtyards, exposed pipes, battered doorways, concrete housing blocks, tiled transit spaces and plain institutional interiors. Place the person against a modest Berlin city background with enough depth to feel inhabited. Choose one understated location; avoid postcard landmarks, the Brandenburg Gate, prominent television towers, Berlin Wall murals and exaggerated Cold War props. Period knitwear, practical jackets, denim or leather should follow the character description; do not turn every person into a punk. No modern objects, cybernetics or visible magical effects.

Character description:
${description}

Given name to include in the image: ${JSON.stringify(givenName)}

Write only this given name, exactly as supplied, as a physical part of the scene. For this portrait, use this name treatment: ${nameTreatments[treatmentIndex]}. Use this selected treatment only; do not switch to another treatment or add a second name placement. The person must not hold a sign, board, placard or any other name display. Do not use wall graffiti. Use believable period lettering and materials, large enough to read, clear of the face. Do not include a surname, patronymic, extra given names, case numbers, captions, logos or any other readable text. Keep the name integrated into the photograph rather than adding a graphic title overlay.`
}
