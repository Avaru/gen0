import type { StudentSheet } from '@/data/characters/never-midnight'
import type { neverMidnightCatalogueJobs, neverMidnightAdditionalJobs } from './never-midnight-jobs'

type Occupation = Lowercase<
  | (typeof neverMidnightCatalogueJobs)[number]['value']
  | (typeof neverMidnightAdditionalJobs)[number]
>
type Discipline = keyof StudentSheet['disciplines']
export interface OccupationProfile {
  disciplines: Partial<Record<Discipline, 1 | 2>>
  subdomain: readonly [Discipline, string]
}

/** Approved occupation bonuses; duplicate jobs share a profile without changing their draw weight. */
export const neverMidnightOccupationProfiles = {
  'pharmacy assistant': {
    disciplines: { Artifice: 2, Science: 1 },
    subdomain: ['Artifice', 'Medicine'],
  },
  'occupational therapist': {
    disciplines: { Artifice: 1, Science: 1, Culture: 1 },
    subdomain: ['Science', 'Psychology'],
  },
  'foreign trade clerk': {
    disciplines: { Society: 1, Culture: 1, Science: 1 },
    subdomain: ['Society', 'Commerce'],
  },
  'bank clerk': { disciplines: { Society: 2, Science: 1 }, subdomain: ['Society', 'Commerce'] },
  'construction drafter': {
    disciplines: { Artifice: 2, Science: 1 },
    subdomain: ['Artifice', 'Construction'],
  },
  'professional driver': {
    disciplines: { Artifice: 2, Science: 1 },
    subdomain: ['Artifice', 'Mechanics'],
  },
  florist: { disciplines: { Artifice: 2, Science: 1 }, subdomain: ['Artifice', 'Crafts'] },
  bookseller: {
    disciplines: { Culture: 1, Society: 1, Science: 1 },
    subdomain: ['Culture', 'Languages'],
  },
  'chemical laboratory technician': {
    disciplines: { Artifice: 2, Science: 1 },
    subdomain: ['Science', 'Chemistry'],
  },
  dietitian: { disciplines: { Science: 2, Artifice: 1 }, subdomain: ['Science', 'Biology'] },
  'dietary cook': { disciplines: { Artifice: 2, Science: 1 }, subdomain: ['Artifice', 'Cooking'] },
  'drugstore assistant': {
    disciplines: { Society: 1, Science: 1, Artifice: 1 },
    subdomain: ['Science', 'Chemistry'],
  },
  'electrical drafter': {
    disciplines: { Artifice: 2, Science: 1 },
    subdomain: ['Artifice', 'Electronics'],
  },
  'residential and after-school care educator': {
    disciplines: { Science: 1, Culture: 1, Society: 1 },
    subdomain: ['Science', 'Psychology'],
  },
  'data preparation worker': {
    disciplines: { Society: 2, Science: 1 },
    subdomain: ['Society', 'Bureaucracy'],
  },
  'data processing worker': {
    disciplines: { Artifice: 2, Science: 1 },
    subdomain: ['Science', 'Mathematics'],
  },
  'childcare worker': {
    disciplines: { Science: 2, Artifice: 1 },
    subdomain: ['Science', 'Psychology'],
  },
  'nursing assistant': {
    disciplines: { Artifice: 2, Science: 1 },
    subdomain: ['Artifice', 'Medicine'],
  },
  'warehouse worker': {
    disciplines: { Society: 2, Artifice: 1 },
    subdomain: ['Society', 'Commerce'],
  },
  'postal worker': { disciplines: { Society: 2, Science: 1 }, subdomain: ['Science', 'Geography'] },
  typist: { disciplines: { Artifice: 2, Society: 1 }, subdomain: ['Society', 'Bureaucracy'] },
  'cargo handling and storage worker': {
    disciplines: { Artifice: 2, Society: 1 },
    subdomain: ['Artifice', 'Mechanics'],
  },
  'goods handling worker': {
    disciplines: { Society: 2, Artifice: 1 },
    subdomain: ['Society', 'Commerce'],
  },
  'meat sales assistant': {
    disciplines: { Society: 2, Artifice: 1 },
    subdomain: ['Society', 'Commerce'],
  },
  'bakery sales assistant': {
    disciplines: { Society: 2, Artifice: 1 },
    subdomain: ['Society', 'Commerce'],
  },
  'specialist sales assistant': {
    disciplines: { Society: 2, Culture: 1 },
    subdomain: ['Society', 'Commerce'],
  },
  'finance clerk': {
    disciplines: { Society: 2, Science: 1 },
    subdomain: ['Science', 'Mathematics'],
  },
  'financial services clerk': {
    disciplines: { Society: 2, Science: 1 },
    subdomain: ['Society', 'Commerce'],
  },
  photographer: {
    disciplines: { Artifice: 1, Science: 1, Culture: 1 },
    subdomain: ['Culture', 'Arts'],
  },
  'photographic laboratory technician': {
    disciplines: { Artifice: 2, Science: 1 },
    subdomain: ['Science', 'Chemistry'],
  },
  hairdresser: {
    disciplines: { Artifice: 1, Culture: 1, Science: 1 },
    subdomain: ['Artifice', 'Crafts'],
  },
  'restaurant worker': {
    disciplines: { Society: 2, Artifice: 1 },
    subdomain: ['Artifice', 'Cooking'],
  },
  'display designer': {
    disciplines: { Artifice: 1, Culture: 1, Society: 1 },
    subdomain: ['Culture', 'Arts'],
  },
  'kindergarten group educator': {
    disciplines: { Science: 1, Culture: 1, Society: 1 },
    subdomain: ['Science', 'Psychology'],
  },
  'retail clerk': { disciplines: { Society: 2, Science: 1 }, subdomain: ['Society', 'Commerce'] },
  midwife: { disciplines: { Artifice: 2, Science: 1 }, subdomain: ['Artifice', 'Medicine'] },
  'residential care educator': {
    disciplines: { Science: 2, Society: 1 },
    subdomain: ['Science', 'Psychology'],
  },
  'after-school care educator': {
    disciplines: { Science: 1, Culture: 1, Society: 1 },
    subdomain: ['Science', 'Psychology'],
  },
  'industrial administration clerk': {
    disciplines: { Society: 2, Artifice: 1 },
    subdomain: ['Society', 'Bureaucracy'],
  },
  'kindergarten teacher': {
    disciplines: { Science: 1, Culture: 1, Society: 1 },
    subdomain: ['Science', 'Psychology'],
  },
  'paediatric nurse': {
    disciplines: { Artifice: 2, Science: 1 },
    subdomain: ['Artifice', 'Medicine'],
  },
  cook: { disciplines: { Artifice: 2, Science: 1 }, subdomain: ['Artifice', 'Cooking'] },
  'nursery educator': {
    disciplines: { Science: 2, Artifice: 1 },
    subdomain: ['Science', 'Psychology'],
  },
  'laboratory technician': {
    disciplines: { Artifice: 2, Science: 1 },
    subdomain: ['Science', 'Chemistry'],
  },
  'food chemistry laboratory technician': {
    disciplines: { Artifice: 2, Science: 1 },
    subdomain: ['Science', 'Chemistry'],
  },
  'mechanical engineering drafter': {
    disciplines: { Artifice: 2, Science: 1 },
    subdomain: ['Artifice', 'Mechanics'],
  },
  'medical technical assistant': {
    disciplines: { Artifice: 2, Science: 1 },
    subdomain: ['Artifice', 'Medicine'],
  },
  'medical laboratory technician': {
    disciplines: { Artifice: 2, Science: 1 },
    subdomain: ['Science', 'Biology'],
  },
  'metal construction drafter': {
    disciplines: { Artifice: 2, Science: 1 },
    subdomain: ['Artifice', 'Construction'],
  },
  'dairy laboratory technician': {
    disciplines: { Artifice: 2, Science: 1 },
    subdomain: ['Science', 'Chemistry'],
  },
  'pharmaceutical assistant': {
    disciplines: { Artifice: 2, Science: 1 },
    subdomain: ['Science', 'Chemistry'],
  },
  'physics laboratory technician': {
    disciplines: { Artifice: 2, Science: 1 },
    subdomain: ['Science', 'Physics'],
  },
  physiotherapist: {
    disciplines: { Artifice: 2, Science: 1 },
    subdomain: ['Artifice', 'Medicine'],
  },
  "doctor's surgery nurse": {
    disciplines: { Artifice: 2, Science: 1 },
    subdomain: ['Artifice', 'Medicine'],
  },
  'dental nurse': { disciplines: { Artifice: 2, Science: 1 }, subdomain: ['Artifice', 'Medicine'] },
  'petrol station attendant': {
    disciplines: { Artifice: 2, Society: 1 },
    subdomain: ['Artifice', 'Mechanics'],
  },
  'transport clerk': {
    disciplines: { Society: 2, Science: 1 },
    subdomain: ['Science', 'Geography'],
  },
  'surveying technician': {
    disciplines: { Artifice: 2, Science: 1 },
    subdomain: ['Science', 'Geography'],
  },
  'insurance clerk': { disciplines: { Society: 2, Science: 1 }, subdomain: ['Society', 'Law'] },
  'advertising clerk': {
    disciplines: { Society: 1, Culture: 1, Science: 1 },
    subdomain: ['Culture', 'Media'],
  },
  'business administration clerk': {
    disciplines: { Society: 2, Science: 1 },
    subdomain: ['Society', 'Bureaucracy'],
  },
  'production planner': {
    disciplines: { Society: 1, Artifice: 1, Science: 1 },
    subdomain: ['Society', 'Bureaucracy'],
  },
  'materials planner': {
    disciplines: { Society: 2, Science: 1 },
    subdomain: ['Society', 'Commerce'],
  },
  dispatcher: { disciplines: { Society: 2, Science: 1 }, subdomain: ['Science', 'Geography'] },
  'brigade leader': {
    disciplines: { Artifice: 1, Society: 1, Science: 1 },
    subdomain: ['Artifice', 'Construction'],
  },
  'personnel officer': {
    disciplines: { Society: 1, Science: 1, Espionage: 1 },
    subdomain: ['Science', 'Psychology'],
  },
  'housing officer': {
    disciplines: { Society: 1, Artifice: 1, Science: 1 },
    subdomain: ['Society', 'Bureaucracy'],
  },
  archivist: { disciplines: { Culture: 2, Society: 1 }, subdomain: ['Culture', 'History'] },
  librarian: { disciplines: { Culture: 2, Society: 1 }, subdomain: ['Culture', 'Languages'] },
  'museum attendant': {
    disciplines: { Culture: 2, Espionage: 1 },
    subdomain: ['Espionage', 'Surveillance'],
  },
  'telephone operator': {
    disciplines: { Society: 1, Artifice: 1, Culture: 1 },
    subdomain: ['Artifice', 'Electronics'],
  },
  caretaker: { disciplines: { Artifice: 2, Society: 1 }, subdomain: ['Artifice', 'Mechanics'] },
} as const satisfies Record<Occupation, OccupationProfile>
