import { afterEach, describe, expect, it, vi } from 'vitest'
import { neverMidnightJobs } from '@/data/never-midnight-jobs'
import { neverMidnightOccupationProfiles } from '@/data/never-midnight-occupation-profiles'
import { generateStudentDisciplines, generateStudentMeans } from '@/patterns/never-midnight/student'
import * as random from '@/helper/rng'

afterEach(() => vi.restoreAllMocks())

describe('Never Midnight occupation bonuses', () => {
  it.each(neverMidnightJobs)('gives %s three points and exactly one supplied subdomain', (job) => {
    const { disciplines, subdomains } = generateStudentDisciplines(job)
    expect(Object.values(disciplines).reduce((sum, rating) => sum + rating - 1, 0)).toBe(3)
    expect(Object.values(disciplines).every((rating) => rating >= 1 && rating <= 3)).toBe(true)
    const chosen = Object.entries(subdomains).filter(([, text]) => text !== '')
    expect(chosen).toHaveLength(1)
    const [discipline, subdomain] = chosen[0]!
    const allowed: Record<string, string[]> = {
      Arms: ['Shooting', 'Melee', 'Tactics', 'Defence', 'Demolitions', 'Weaponry'],
      Artifice: ['Mechanics', 'Construction', 'Electronics', 'Medicine', 'Crafts', 'Cooking'],
      Espionage: [
        'Stealth',
        'Disguise',
        'Surveillance',
        'Infiltration',
        'Deception',
        'Investigation',
      ],
      Science: ['Physics', 'Chemistry', 'Biology', 'Psychology', 'Mathematics', 'Geography'],
      Society: ['Commerce', 'Law', 'Politics', 'Bureaucracy', 'Warfare', 'Crime'],
      Culture: ['Languages', 'History', 'Religion', 'Folklore', 'Arts', 'Media'],
    }
    expect(allowed[discipline]).toContain(subdomain)
    expect(disciplines[discipline as keyof typeof disciplines]).toBeGreaterThan(1)
  })

  it('retains the approved split and three-way examples, including repeated job names', () => {
    expect(neverMidnightOccupationProfiles['chemical laboratory technician']).toEqual({
      disciplines: { Artifice: 2, Science: 1 },
      subdomain: ['Science', 'Chemistry'],
    })
    expect(neverMidnightOccupationProfiles['photographer']).toEqual({
      disciplines: { Artifice: 1, Science: 1, Culture: 1 },
      subdomain: ['Culture', 'Arts'],
    })
    expect(generateStudentDisciplines('Laboratory technician')).toEqual(
      generateStudentDisciplines('laboratory technician'),
    )
    expect(() => generateStudentDisciplines('Unknown occupation')).toThrow(
      'Missing occupation profile',
    )
  })

  it('reaches all six Means allocations with equal random intervals', () => {
    const rng = vi.spyOn(random, 'rng')
    const allocations = new Set<string>()
    for (let index = 0; index < 6; index++) {
      for (const offset of [0, 0.999999]) {
        rng.mockReturnValue((index + offset) / 6)
        const means = generateStudentMeans()
        const ratings = Object.values(means)
        expect(ratings.reduce((sum, rating) => sum + rating, 0)).toBe(6)
        expect(ratings.every((rating) => rating >= 1 && rating <= 3)).toBe(true)
        expect([...ratings].sort()).toEqual([1, 2, 3])
        allocations.add(JSON.stringify(means))
      }
    }
    expect(allocations.size).toBe(6)
  })
})
