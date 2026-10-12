import { defineStore } from 'pinia'
import { computed, onScopeDispose, ref, watch } from 'vue'
import { cbrPnkCatalogue } from '@/data/characters/cbr-pnk'
import {
  cbrPnkAngles,
  cbrPnkExpertiseAliases,
  cbrPnkExpertiseOptions,
  cbrPnkGearColumns,
} from '@/data/characters/cbr-pnk-sheet'
import { composeAugmentation } from '@/patterns/cyberpunk/augmentations/augmentations'
import { varyRatings } from '@/patterns/cyberpunk/runners/ratings'
import { DATA, load } from '@/builders/load'
import type { GenerationOptions } from '@/generator/options'
import { randomFrom } from '@/helper/randomFrom'
import type { CharacterSheet, Rating, SheetRating } from '@/data/characters/types'

const storageKey = 'gen0.character'

function isUsableSheet(value: unknown, blank: CharacterSheet): value is CharacterSheet {
  if (!value || typeof value !== 'object') return false
  const saved = value as CharacterSheet
  const isRating = (rating: unknown) =>
    rating === null || rating === 0 || rating === 1 || rating === 2
  return (
    saved.systemId === blank.systemId &&
    (saved.specialArmor === undefined || typeof saved.specialArmor === 'boolean') &&
    (saved.runner === undefined ||
      (saved.runner !== null &&
        typeof saved.runner.alias === 'string' &&
        typeof saved.runner.description === 'string' &&
        (saved.runner.angle === undefined || cbrPnkAngles.includes(saved.runner.angle)) &&
        (saved.runner.archetypeId === undefined ||
          cbrPnkCatalogue.archetypes.some((item) => item.id === saved.runner.archetypeId)))) &&
    (saved.gear === undefined ||
      (saved.gear !== null &&
        ['', 'light', 'medium', 'heavy'].includes(saved.gear.level) &&
        Array.isArray(saved.gear.selected) &&
        saved.gear.selected.every((name) =>
          cbrPnkGearColumns.flat().some((item) => item.name === name),
        ) &&
        new Set(saved.gear.selected).size === saved.gear.selected.length &&
        Array.isArray(saved.gear.extra) &&
        saved.gear.extra.length === 4 &&
        saved.gear.extra.every((mark) => typeof mark === 'boolean'))) &&
    Number.isInteger(saved.stress) &&
    saved.stress >= 0 &&
    saved.stress <= 7 &&
    Array.isArray(saved.attributeRatings) &&
    saved.attributeRatings.length === blank.attributeRatings.length &&
    saved.attributeRatings.every(
      (row, i) =>
        row?.definitionId === blank.attributeRatings[i]?.definitionId && isRating(row.value),
    ) &&
    Array.isArray(saved.skillRatings) &&
    saved.skillRatings.length === blank.skillRatings.length &&
    saved.skillRatings.every(
      (row, i) => row?.definitionId === blank.skillRatings[i]?.definitionId && isRating(row.value),
    ) &&
    Array.isArray(saved.expertises) &&
    saved.expertises.length === blank.expertises.length &&
    saved.expertises.every(
      (row, i) =>
        row?.skillId === blank.expertises[i]?.skillId &&
        Array.isArray(row.values) &&
        row.values.every((item) => typeof item === 'string') &&
        (row.custom === undefined || typeof row.custom === 'string'),
    ) &&
    Array.isArray(saved.glitches) &&
    saved.glitches.length === blank.glitches.length &&
    saved.glitches.every(
      (row, i) =>
        row?.attributeId === blank.glitches[i]?.attributeId && typeof row.marked === 'boolean',
    ) &&
    Array.isArray(saved.harm) &&
    saved.harm.length === blank.harm.length &&
    saved.harm.every(
      (row, i) =>
        row?.level === blank.harm[i]?.level &&
        typeof row.description === 'string' &&
        Array.isArray(row.marks) &&
        row.marks.length === blank.harm[i]?.marks.length &&
        row.marks.every((mark) => typeof mark === 'boolean'),
    ) &&
    Array.isArray(saved.augmentations) &&
    saved.augmentations.length === blank.augmentations.length &&
    saved.augmentations.every(
      (row) => row && typeof row.description === 'string' && typeof row.glitched === 'boolean',
    )
  )
}

export const useCharacterStore = defineStore('character', () => {
  const system = cbrPnkCatalogue.systems.find((item) => item.id === 'cbr-pnk')!
  const attributes = cbrPnkCatalogue.attributes
    .filter((item) => item.systemId === system.id)
    .sort((a, b) => a.sortOrder - b.sortOrder)
  const skills = cbrPnkCatalogue.skills
    .filter((item) => item.systemId === system.id)
    .sort((a, b) => a.sortOrder - b.sortOrder)
  const createBlankSheet = (): CharacterSheet => ({
    systemId: system.id,
    runner: { alias: '', description: '' },
    stress: 0,
    specialArmor: false,
    gear: { level: 'medium', selected: [], extra: [false, false, false, false] },
    augmentations: Array.from({ length: 3 }, () => ({ description: '', glitched: false })),
    attributeRatings: attributes.map((item) => ({ definitionId: item.id, value: null })),
    skillRatings: skills.map((item) => ({ definitionId: item.id, value: null })),
    expertises: skills.map((item) => ({ skillId: item.id, values: [] })),
    glitches: attributes.map((item) => ({ attributeId: item.id, marked: false })),
    harm: [
      { level: 1, description: '', marks: [false, false] },
      { level: 2, description: '', marks: [false, false] },
      { level: 3, description: '', marks: [false] },
    ],
  })
  const blank = createBlankSheet()
  const sheet = ref(blank)
  const hasContent = computed(() => {
    const value = sheet.value
    return Boolean(
      value.runner.alias ||
      value.runner.description ||
      value.runner.archetypeId ||
      value.runner.angle ||
      value.stress ||
      value.specialArmor ||
      value.gear.level !== 'medium' ||
      value.gear.selected.length ||
      value.gear.extra.some(Boolean) ||
      value.attributeRatings.some((row) => (row.value ?? 0) > 0) ||
      value.skillRatings.some((row) => (row.value ?? 0) > 0) ||
      value.expertises.some((row) => row.values.length || row.custom?.trim()) ||
      value.glitches.some((row) => row.marked) ||
      value.harm.some((row) => row.description || row.marks.some(Boolean)) ||
      value.augmentations.some((row) => row.description || row.glitched),
    )
  })
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
    if (isUsableSheet(saved, blank))
      sheet.value = {
        ...saved,
        specialArmor: saved.specialArmor ?? false,
        runner: saved.runner ?? blank.runner,
        gear: saved.gear ? { ...saved.gear, level: saved.gear.level || 'medium' } : blank.gear,
      }
  } catch {
    // Missing access or invalid JSON leaves the sheet blank.
  }
  let saveTimer: ReturnType<typeof setTimeout> | undefined
  let pendingSave = false
  function save() {
    clearTimeout(saveTimer)
    saveTimer = undefined
    pendingSave = false
    try {
      localStorage.setItem(storageKey, JSON.stringify(sheet.value))
    } catch {
      // The sheet remains editable when storage is unavailable.
    }
  }
  function flushSave() {
    if (pendingSave) save()
  }
  // Typing only reads the editable strings; it does not traverse or serialize the whole sheet.
  watch(
    () => [
      sheet.value.runner.alias,
      sheet.value.runner.description,
      ...sheet.value.harm.map((row) => row.description),
      ...sheet.value.augmentations.map((row) => row.description),
      ...sheet.value.expertises.map((row) => row.custom),
    ],
    () => {
      pendingSave = true
      clearTimeout(saveTimer)
      saveTimer = setTimeout(save, 200)
    },
  )
  // Checkboxes, generation and reset still save at the end of the current Vue update.
  watch(
    () => [
      sheet.value.runner.archetypeId,
      sheet.value.runner.angle,
      sheet.value.stress,
      sheet.value.specialArmor,
      sheet.value.gear.level,
      [...sheet.value.gear.selected],
      [...sheet.value.gear.extra],
      sheet.value.attributeRatings.map((row) => row.value),
      sheet.value.skillRatings.map((row) => row.value),
      sheet.value.expertises.map((row) => [...row.values]),
      sheet.value.glitches.map((row) => row.marked),
      sheet.value.harm.map((row) => [...row.marks]),
      sheet.value.augmentations.map((row) => row.glitched),
    ],
    save,
    { deep: true },
  )
  function visibilityChanged() {
    if (document.visibilityState === 'hidden') flushSave()
  }
  window.addEventListener('pagehide', flushSave)
  document.addEventListener('visibilitychange', visibilityChanged)
  onScopeDispose(() => {
    flushSave()
    window.removeEventListener('pagehide', flushSave)
    document.removeEventListener('visibilitychange', visibilityChanged)
  })
  function applyArchetype(options: GenerationOptions = {}) {
    const profile = cbrPnkCatalogue.archetypeSystemProfiles.find(
      (item) =>
        item.archetypeId === sheet.value.runner.archetypeId &&
        item.systemId === sheet.value.systemId,
    )
    const ratingFor = (ratings: Rating[] | undefined, id: string): SheetRating => {
      const value = ratings?.find((row) => row.definitionId === id)?.value
      // A source 3 means two rating points plus one expertise, not a third box.
      return value === undefined ? null : (Math.min(value, 2) as SheetRating)
    }
    sheet.value = {
      ...sheet.value,
      attributeRatings: attributes.map((item) => ({
        definitionId: item.id,
        value: ratingFor(profile?.attributeRatings, item.id),
      })),
      skillRatings: skills.map((item) => ({
        definitionId: item.id,
        value: ratingFor(profile?.skillRatings, item.id),
      })),
      expertises: skills.map((skill) => {
        const sourceRating = profile?.skillRatings.find(
          (row) => row.definitionId === skill.id,
        )?.value
        const suggestions = profile?.expertiseSuggestions.find((row) => row.skillId === skill.id)
        const choices = [
          ...new Set(
            (suggestions?.options ?? [])
              .map((option) => cbrPnkExpertiseAliases[skill.key]?.[option] ?? option)
              .filter((option) => cbrPnkExpertiseOptions[skill.key]?.includes(option)),
          ),
        ]
        return {
          skillId: skill.id,
          values: sourceRating === 3 && choices.length ? [randomFrom(choices)] : [],
        }
      }),
    }
    if (profile) {
      varyRatings(sheet.value.attributeRatings)
      varyRatings(sheet.value.skillRatings)
    }
    const archetypeId = sheet.value.runner.archetypeId
    const eligibleAugmentations = load(DATA.AUGMENTATIONS, options).filter(
      (entry) => archetypeId !== undefined && entry.archetypeIds.includes(archetypeId),
    )
    const generatedAugmentation = eligibleAugmentations.length
      ? composeAugmentation(randomFrom(eligibleAugmentations), options)
      : undefined
    const augmentation = [generatedAugmentation?.primary, generatedAugmentation?.details]
      .filter(Boolean)
      .join(' · ')
      .replace(/\n/g, ' · ')
    sheet.value.augmentations = sheet.value.augmentations.map((_, index) => ({
      description: index === 0 ? augmentation : '',
      glitched: false,
    }))
  }

  function reset() {
    sheet.value = createBlankSheet()
  }
  function importCharacter(json: string) {
    const imported: unknown = JSON.parse(json)
    const defaults = createBlankSheet()
    if (!isUsableSheet(imported, defaults)) throw new Error('Invalid character JSON')
    sheet.value = {
      ...imported,
      specialArmor: imported.specialArmor ?? false,
      runner: imported.runner ?? defaults.runner,
      gear: imported.gear
        ? { ...imported.gear, level: imported.gear.level || 'medium' }
        : defaults.gear,
    }
    save()
  }
  return {
    system: ref(system),
    attributes: ref(attributes),
    skills: ref(skills),
    sheet,
    hasContent,
    applyArchetype,
    reset,
    importCharacter,
  }
})
