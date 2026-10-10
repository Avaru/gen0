export type NameRule =
  | { kind: 'western'; secondGiven: number; secondSurname: number; hyphenatedSurname: number }
  | { kind: 'surname-first' | 'tamil' }
  | { kind: 'spanish' | 'greek'; secondGiven: number }
  | { kind: 'polish'; secondGiven: number; secondSurname: number }
  | { kind: 'russian'; patronymic: number }
  | { kind: 'arabic'; fatherName: number; marker: number }

const western = (secondGiven = 0, secondSurname = 0, hyphenatedSurname = 0): NameRule => ({
  kind: 'western',
  secondGiven,
  secondSurname,
  hyphenatedSurname,
})

/** One definition for each supported tradition: label and composition rules. */
export const namingTraditions = {
  'us-american': { label: 'US American', rule: western(0.15, 0.15, 0.5) },
  british: { label: 'British', rule: western(0.15, 0.15, 0.5) },
  chinese: { label: 'Chinese', rule: { kind: 'surname-first' } },
  dutch: { label: 'Dutch', rule: western() },
  german: { label: 'German', rule: western(0.15, 0.15, 0.5) },
  french: { label: 'French', rule: western(0.1, 0.15) },
  greek: { label: 'Greek', rule: { kind: 'greek', secondGiven: 0.1 } },
  hindi: { label: 'Hindi-speaking Indian', rule: western() },
  italian: { label: 'Italian', rule: western(0.15, 0.05) },
  japanese: { label: 'Japanese', rule: { kind: 'surname-first' } },
  korean: { label: 'Korean', rule: { kind: 'surname-first' } },
  polish: { label: 'Polish', rule: { kind: 'polish', secondGiven: 0.25, secondSurname: 0.1 } },
  russian: { label: 'Russian', rule: { kind: 'russian', patronymic: 0.75 } },
  spanish: { label: 'Spanish', rule: { kind: 'spanish', secondGiven: 0.15 } },
  swedish: { label: 'Swedish', rule: western() },
  tamil: { label: 'Tamil', rule: { kind: 'tamil' } },
  turkish: { label: 'Turkish', rule: western() },
  ukrainian: { label: 'Ukrainian', rule: western() },
  vietnamese: { label: 'Vietnamese', rule: { kind: 'surname-first' } },
  arabic: { label: 'Arabic', rule: { kind: 'arabic', fatherName: 0.5, marker: 0.5 } },
} satisfies Record<string, { label: string; rule: NameRule }>

export type NameNationality = keyof typeof namingTraditions
export const traditionIds = Object.keys(namingTraditions) as NameNationality[]

export function isNameNationality(value: string): value is NameNationality {
  return Object.prototype.hasOwnProperty.call(namingTraditions, value)
}
