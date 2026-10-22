import {
  createStudentSheet,
  type StudentRating,
  type StudentSheet,
} from '@/data/characters/never-midnight'
import {
  neverMidnightOccupationProfiles,
  type OccupationProfile,
} from '@/data/never-midnight-occupation-profiles'
import { randomFrom } from '@/helper/randomFrom'

/** Each +2/+1 allocation above the starting ratings of 1 is equally likely. */
export function generateStudentMeans(): StudentSheet['means'] {
  const [Blood, Thought, Voice] = randomFrom([
    [3, 2, 1],
    [3, 1, 2],
    [2, 3, 1],
    [1, 3, 2],
    [2, 1, 3],
    [1, 2, 3],
  ] as const)
  return { Blood, Thought, Voice }
}

export function generateStudentDisciplines(occupation: string) {
  const profile = (neverMidnightOccupationProfiles as Record<string, OccupationProfile>)[
    occupation.toLowerCase()
  ]
  if (!profile) throw new Error('Missing occupation profile')
  const { disciplines, subdomains } = createStudentSheet()
  for (const [name, bonus] of Object.entries(profile.disciplines)) {
    disciplines[name as keyof typeof disciplines] = (1 + bonus) as StudentRating
  }
  const [discipline, subdomain] = profile.subdomain
  subdomains[discipline] = subdomain
  return { disciplines, subdomains }
}
