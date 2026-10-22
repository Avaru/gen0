import type { NameGender } from '@/data/nameTypes'

export type StudentRating = 1 | 2 | 3

export const means = ['Blood', 'Thought', 'Voice'] as const
export const disciplines = [
  { name: 'Arms', type: 'Skill' },
  { name: 'Artifice', type: 'Skill' },
  { name: 'Espionage', type: 'Skill' },
  { name: 'Science', type: 'Knowledge' },
  { name: 'Society', type: 'Knowledge' },
  { name: 'Culture', type: 'Knowledge' },
] as const

export interface StudentEntry {
  description: string
  value?: StudentRating
}
export interface StudentSheet {
  systemId: 'never-midnight'
  nationality?: 'german' | 'russian' | 'polish'
  genders?: NameGender[]
  student: {
    name: string
    description: string
    keepsake: string
  }
  means: Record<(typeof means)[number], StudentRating>
  disciplines: Record<(typeof disciplines)[number]['name'], StudentRating>
  subdomains: Record<(typeof disciplines)[number]['name'], string>
  spells: StudentEntry[]
  sacrifices: StudentEntry[]
}

export function createStudentSheet(): StudentSheet {
  return {
    systemId: 'never-midnight',
    student: { name: '', description: '', keepsake: '' },
    means: { Blood: 1, Thought: 1, Voice: 1 },
    disciplines: { Arms: 1, Artifice: 1, Espionage: 1, Science: 1, Society: 1, Culture: 1 },
    subdomains: { Arms: '', Artifice: '', Espionage: '', Science: '', Society: '', Culture: '' },
    spells: [],
    sacrifices: [],
  }
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}
function rating(value: unknown): value is StudentRating {
  return value === 1 || value === 2 || value === 3
}
export function isStudentSheet(value: unknown): value is StudentSheet {
  if (!record(value) || value.systemId !== 'never-midnight') return false
  const {
    student,
    means: savedMeans,
    disciplines: savedDisciplines,
    subdomains: savedSubdomains,
  } = value
  return (
    (value.nationality === undefined ||
      ['german', 'russian', 'polish'].includes(value.nationality as string)) &&
    (value.genders === undefined ||
      (Array.isArray(value.genders) &&
        value.genders.length > 0 &&
        value.genders.length <= 2 &&
        value.genders.every((gender) => gender === 'm' || gender === 'f') &&
        new Set(value.genders).size === value.genders.length)) &&
    record(student) &&
    Object.keys(createStudentSheet().student).every((key) => typeof student[key] === 'string') &&
    record(savedMeans) &&
    means.every((key) => rating(savedMeans[key])) &&
    record(savedDisciplines) &&
    disciplines.every(({ name }) => rating(savedDisciplines[name])) &&
    record(savedSubdomains) &&
    disciplines.every(({ name }) => typeof savedSubdomains[name] === 'string') &&
    Array.isArray(value.spells) &&
    value.spells.every(
      (row: unknown) =>
        record(row) && typeof row.description === 'string' && row.value === undefined,
    ) &&
    Array.isArray(value.sacrifices) &&
    value.sacrifices.every(
      (row: unknown) => record(row) && typeof row.description === 'string' && rating(row.value),
    )
  )
}

/** Preserve the original separate fields when opening saved student files. */
export function restoreStudentSheet(value: unknown): StudentSheet | undefined {
  if (record(value) && record(value.student) && value.student.description === undefined) {
    const { name, looks, distinguishingMarks, occupation, keepsake } = value.student
    if (
      [name, looks, distinguishingMarks, occupation, keepsake].every(
        (field) => typeof field === 'string',
      )
    ) {
      value = {
        ...value,
        student: {
          name,
          description: [looks, distinguishingMarks, occupation].filter(Boolean).join(' · '),
          keepsake,
        },
      }
    }
  }
  if (record(value) && record(value.disciplines)) {
    const { Prowess, Intrigue, ...current } = value.disciplines
    value = {
      ...value,
      disciplines: {
        ...current,
        Arms: current.Arms ?? Prowess,
        Espionage: current.Espionage ?? Intrigue,
      },
    }
  }
  if (record(value) && Array.isArray(value.spells)) {
    value = {
      ...value,
      spells: value.spells.map((row: unknown) =>
        record(row) ? { description: row.description } : row,
      ),
    }
  }
  if (record(value) && value.subdomains === undefined) {
    value = { ...value, subdomains: createStudentSheet().subdomains }
  }
  return isStudentSheet(value) ? value : undefined
}
