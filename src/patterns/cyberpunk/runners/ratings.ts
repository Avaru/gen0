import type { CharacterSheet } from '@/data/characters/types'
import { p } from '@/helper/prob'
import { randomFrom } from '@/helper/randomFrom'

/** Move one point within a freshly copied profile, retaining its total and rating limit. */
export function varyRatings(ratings: CharacterSheet['attributeRatings']): void {
  if (!p(0.2)) return
  const donors = ratings.filter((row) =>
    (row.value === 1 || row.value === 2) &&
    ratings.some((other) => other !== row && other.value !== null && other.value < 2),
  )
  if (!donors.length) return
  const donor = randomFrom(donors)
  const recipients = ratings.filter((row) => row !== donor && row.value !== null && row.value < 2)
  const recipient = randomFrom(recipients)
  donor.value = donor.value === 2 ? 1 : 0
  recipient.value = recipient.value === 1 ? 2 : 1
}
