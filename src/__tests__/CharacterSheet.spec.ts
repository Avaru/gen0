// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { createPinia } from 'pinia'
import { mount } from '@vue/test-utils'
import CharacterView from '@/views/CharacterView.vue'
import { useCharacterStore } from '@/stores/character'
import { cbrPnkCatalogue } from '@/data/characters/cbr-pnk'

describe('editable CBR+PNK sheet', () => {
  it('stores three independent augmentation entries and glitch marks across navigation', async () => {
    const pinia = createPinia()
    const wrapper = mount(CharacterView, { global: { plugins: [pinia] } })
    const store = useCharacterStore(pinia)
    await wrapper.get('[aria-label="Augmentation 2"]').setValue('Wired reflexes')
    await wrapper.get('[aria-label="Augmentation 2 glitched"]').setValue(true)
    expect(store.sheet.augmentations).toEqual([
      { description: '', glitched: false },
      { description: 'Wired reflexes', glitched: true },
      { description: '', glitched: false },
    ])
    wrapper.unmount()
    const remounted = mount(CharacterView, { global: { plugins: [pinia] } })
    expect(remounted.get('[aria-label="Augmentation 2"]').element).toHaveProperty(
      'value',
      'Wired reflexes',
    )
    expect(remounted.get('[aria-label="Augmentation 2 glitched"]').element).toHaveProperty(
      'checked',
      true,
    )
    await remounted.get('[aria-label="Augmentation 2 glitched"]').setValue(false)
    expect(store.sheet.augmentations[1]?.description).toBe('Wired reflexes')
    expect(store.sheet.augmentations[1]?.glitched).toBe(false)
    expect(useCharacterStore(createPinia()).sheet.augmentations).toEqual(
      Array.from({ length: 3 }, () => ({ description: '', glitched: false })),
    )
    remounted.unmount()
  })
  it('fills stress through the selected slot, clears subsequent slots, and retains it across navigation', async () => {
    const pinia = createPinia()
    const wrapper = mount(CharacterView, { global: { plugins: [pinia] } })
    const store = useCharacterStore(pinia)
    const slot = (position: number) => wrapper.get(`[aria-label="Stress slot ${position}"]`)
    await slot(5).setValue(true)
    expect(store.sheet.stress).toBe(5)
    for (let position = 1; position <= 7; position++) {
      expect(slot(position).element).toHaveProperty('checked', position <= 5)
    }
    await slot(3).setValue(false)
    expect(store.sheet.stress).toBe(2)
    for (let position = 1; position <= 7; position++) {
      expect(slot(position).element).toHaveProperty('checked', position <= 2)
    }
    await slot(7).setValue(true)
    expect(store.sheet.stress).toBe(7)
    expect(wrapper.get('.overload').classes()).toContain('active')
    expect(store.sheet.glitches.every((row) => !row.marked)).toBe(true)
    wrapper.unmount()
    const remounted = mount(CharacterView, { global: { plugins: [pinia] } })
    expect(remounted.get('[aria-label="Stress slot 7"]').element).toHaveProperty('checked', true)
    await remounted.get('[aria-label="Stress slot 7"]').setValue(false)
    expect(store.sheet.stress).toBe(6)
    expect(remounted.get('.overload').classes()).not.toContain('active')
    await remounted.get('[aria-label="Stress slot 1"]').setValue(false)
    expect(store.sheet.stress).toBe(0)
    expect(useCharacterStore(createPinia()).sheet.stress).toBe(0)
    remounted.unmount()
  })
  it('stores harm descriptions and independent slots, turning yellow/red only when a level is full', async () => {
    const pinia = createPinia()
    const wrapper = mount(CharacterView, { global: { plugins: [pinia] } })
    const store = useCharacterStore(pinia)
    const card = wrapper.get('.harm-card')
    expect(card.attributes('data-state')).toBe('empty')
    await wrapper.get('[aria-label="Level 1 harm description"]').setValue('Bruised')
    expect(store.sheet.harm[0]?.description).toBe('Bruised')
    const slot = (level: number, position: number) =>
      wrapper.get(`[aria-label="Level ${level} harm slot ${position}"]`)
    await slot(1, 2).setValue(true)
    expect(store.sheet.harm[0]?.marks).toEqual([false, true])
    expect(card.attributes('data-state')).toBe('empty')
    await slot(1, 1).setValue(true)
    expect(card.attributes('data-state')).toBe('yellow')
    await slot(2, 1).setValue(true)
    expect(card.attributes('data-state')).toBe('yellow')
    await slot(2, 2).setValue(true)
    expect(card.attributes('data-state')).toBe('red')
    await slot(2, 1).setValue(false)
    expect(card.attributes('data-state')).toBe('yellow')
    await slot(3, 1).setValue(true)
    expect(card.attributes('data-state')).toBe('red')
    await slot(3, 1).setValue(false)
    await slot(1, 1).setValue(false)
    expect(card.attributes('data-state')).toBe('empty')
    wrapper.unmount()
    const remounted = mount(CharacterView, { global: { plugins: [pinia] } })
    expect(remounted.get('[aria-label="Level 1 harm description"]').element).toHaveProperty(
      'value',
      'Bruised',
    )
    expect(remounted.get('[aria-label="Level 1 harm slot 2"]').element).toHaveProperty(
      'checked',
      true,
    )
    remounted.unmount()
  })
  it('starts blank and connects catalogue fields to Pinia without changing profiles', async () => {
    const pinia = createPinia()
    const source = JSON.stringify(cbrPnkCatalogue)
    const wrapper = mount(CharacterView, { global: { plugins: [pinia] } })
    const store = useCharacterStore(pinia)
    expect(wrapper.findAll('input[type="number"]')).toHaveLength(0)
    expect(wrapper.findAll('input[type="checkbox"]')).toHaveLength(49)
    expect(wrapper.findAll('input[type="text"]')).toHaveLength(17)
    for (const input of wrapper.findAll('input')) {
      expect(input.element).toHaveProperty(
        input.attributes('type') === 'checkbox' ? 'checked' : 'value',
        input.attributes('type') === 'checkbox' ? false : '',
      )
    }
    expect(store.sheet.systemId).toBe('cbr-pnk')
    expect(store.sheet.skillRatings.map((row) => row.definitionId)).toEqual(
      store.skills.map((row) => row.id),
    )
    expect(wrapper.findAll('h2').map((heading) => heading.text())).toEqual([
      'Approaches',
      'Harm',
      'Stress',
      'Skills',
      'Augmentations',
    ])
    for (const [label, row] of [
      ['Aggressive', store.sheet.attributeRatings[0]!],
      [
        'Coding',
        store.sheet.skillRatings.find((item) => item.definitionId === 'cbr-pnk.skill.coding')!,
      ],
    ] as const) {
      const left = wrapper.get(`[aria-label="${label} rating 1"]`)
      const right = wrapper.get(`[aria-label="${label} rating 2"]`)
      expect(row.value).toBeNull()
      await right.setValue(true)
      expect(row.value).toBe(2)
      expect(left.element).toHaveProperty('checked', true)
      expect(right.element).toHaveProperty('checked', true)
      await right.setValue(false)
      expect(row.value).toBe(1)
      expect(left.element).toHaveProperty('checked', true)
      await left.setValue(false)
      expect(row.value).toBe(0)
      expect(right.element).toHaveProperty('checked', false)
      await left.setValue(true)
      expect(row.value).toBe(1)
      expect(right.element).toHaveProperty('checked', false)
      await right.setValue(true)
      await left.setValue(false)
      expect(row.value).toBe(0)
      expect(left.element).toHaveProperty('checked', false)
      expect(right.element).toHaveProperty('checked', false)
    }
    const codingRow = wrapper.get('[aria-label="Coding rating 1"]').element.closest('.skill')!
    expect(codingRow.getAttribute('data-state')).toBe('0')
    await wrapper.get('[aria-label="Coding rating 1"]').setValue(true)
    expect(codingRow.getAttribute('data-state')).toBe('1')
    await wrapper.get('[aria-label="Coding rating 2"]').setValue(true)
    expect(codingRow.getAttribute('data-state')).toBe('2')
    await wrapper.get('[aria-label="Coding expertise"]').setValue('Hack')
    expect(wrapper.get('[aria-label="Coding expertise"]').classes()).toContain('filled')
    expect(
      store.sheet.expertises.find((row) => row.skillId === 'cbr-pnk.skill.coding')?.value,
    ).toBe('Hack')
    await wrapper.get('[aria-label="Aggressive glitched"]').setValue(true)
    expect(store.sheet.glitches[0]?.marked).toBe(true)
    const approach = wrapper.get('.approach')
    expect(approach.attributes('data-state')).toBe('glitched')
    expect(approach.get('.approach-name').text()).toBe('Aggressive')
    expect(approach.get('.approach-title .approach-negative').text()).toBe('// Hesitation')
    expect(approach.get('.approach-negative').classes()).toContain('visible')
    expect(store.sheet.attributeRatings[0]?.value).toBe(0)
    await wrapper.get('[aria-label="Aggressive glitched"]').setValue(false)
    expect(approach.get('.approach-name').text()).toBe('Aggressive')
    expect(approach.attributes('data-state')).toBe('0')
    expect(approach.get('.approach-negative').classes()).not.toContain('visible')
    await wrapper.get('[aria-label="Aggressive rating 1"]').setValue(true)
    expect(approach.attributes('data-state')).toBe('1')
    await wrapper.get('[aria-label="Aggressive rating 2"]').setValue(true)
    expect(approach.attributes('data-state')).toBe('2')
    await wrapper.get('[aria-label="Aggressive glitched"]').setValue(true)
    expect(approach.attributes('data-state')).toBe('glitched')
    expect(store.sheet.attributeRatings[0]?.value).toBe(2)
    await wrapper.get('[aria-label="Aggressive glitched"]').setValue(false)
    expect(approach.attributes('data-state')).toBe('2')
    expect(wrapper.text()).toContain('Weird')
    expect(JSON.stringify(cbrPnkCatalogue)).toBe(source)
    wrapper.unmount()
    const fresh = useCharacterStore(createPinia())
    expect(fresh.sheet.attributeRatings.every((row) => row.value === null)).toBe(true)
  })
})
