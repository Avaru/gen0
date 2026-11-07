export const mothershipClasses = ['Marine', 'Android', 'Scientist', 'Teamster'] as const
export type MothershipClass = (typeof mothershipClasses)[number]

export const mothershipTraumaResponses: Record<MothershipClass, string> = {
  Marine: 'Whenever you panic, every close friendly player must make a Fear save.',
  Android: 'Fear saves made by close friendly players are at disadvantage.',
  Scientist: 'Whenever you fail a Sanity save, all close friendly players gain 1 Stress.',
  Teamster: 'Once per session, you may take advantage on a Panic Check.',
}
