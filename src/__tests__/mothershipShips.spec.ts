import { afterEach, describe, expect, it, vi } from 'vitest'
import { mothershipShipMinorIssues, mothershipShipMajorIssues } from '@/data/mothership-ship-issues'
import { shipName } from '@/patterns/mothership/names'
import {
  formatMothershipShipClass,
  formatMothershipShipIssues,
  rollMothershipShip,
} from '@/patterns/mothership/ships'

afterEach(() => vi.restoreAllMocks())

describe('Mothership ship classes', () => {
  it.each([
    [0, 0, '0', 'Shuttle'],
    [0, 0.5, '0', 'Fighter'],
    [0, 0.99, '0', 'Dropship'],
    [1, 0, 'I', 'Raider'],
    [1, 0.99, 'I', 'Executive Transport'],
    [2, 0, 'II', 'Freighter'],
    [2, 0.99, 'II', 'Patrol Craft'],
    [3, 0, 'III', 'Salvage Cutter'],
    [3, 0.99, 'III', 'Jumpliner'],
    [4, 0, 'IV', 'Corvette'],
    [5, 0, 'V', 'Exploration Vessel'],
    [5, 0.99, 'V', 'Troopship'],
  ])(
    'uses the supplied example for class %s at draw %s',
    (classIndex, typeDraw, shipClass, shipType) => {
      vi.spyOn(Math, 'random')
        .mockReturnValue(0)
        .mockReturnValueOnce((Number(classIndex) + 0.1) / 6)
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(Number(typeDraw))
      const ship = rollMothershipShip()
      expect(ship).toMatchObject({ shipClass, shipType, jumpRating: 1 })
      expect(formatMothershipShipClass(ship)).toBe(`J1C-${shipClass} ${shipType}`)
    },
  )

  it.each([
    [0, 1],
    [1 / 3 - 0.000001, 1],
    [1 / 3, 2],
    [2 / 3 - 0.000001, 2],
    [2 / 3, 3],
    [0.999999, 3],
  ])('gives Jump ratings 1–3 equal chances (%s)', (draw, jumpRating) => {
    vi.spyOn(Math, 'random').mockReturnValue(0).mockReturnValueOnce(0).mockReturnValueOnce(draw)
    expect(rollMothershipShip().jumpRating).toBe(jumpRating)
  })
})

describe('Mothership ship maintenance', () => {
  it.each([
    [0, 1],
    [0.499999, 1],
    [0.5, 2],
    [0.999999, 2],
  ])('picks one or two distinct minor issues (%s)', (draw, count) => {
    vi.spyOn(Math, 'random')
      .mockReturnValue(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(draw)
    const ship = rollMothershipShip()
    expect(ship.maintenanceIssues).toHaveLength(count)
    expect(new Set(ship.maintenanceIssues).size).toBe(count)
    expect(ship.maintenanceIssues).toEqual(mothershipShipMinorIssues.slice(0, count))
  })

  it.each([
    [0, true],
    [0.199999, true],
    [0.2, false],
    [0.999999, false],
  ])('adds a major issue independently with 20%% chance (%s)', (draw, hasMajor) => {
    vi.spyOn(Math, 'random')
      .mockReturnValue(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.99)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(draw)
    const ship = rollMothershipShip()
    expect(ship.maintenanceIssues).toHaveLength(2)
    expect(ship.majorIssue).toBe(hasMajor ? 'Oxygen leak.' : undefined)
    expect(formatMothershipShipIssues(ship)).toBe(
      `Rancid smell permeates cabins. Huge mess everywhere.${hasMajor ? ' Major issue: Oxygen leak.' : ''}`,
    )
  })

  it('stores the class and issues behind the displayed secondary and detail text', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999999)
    const result = shipName({ setting: 'mothership' })
    expect(result.mothershipShip).toBeDefined()
    const ship = result.mothershipShip!
    expect(result.secondary).toBe(formatMothershipShipClass(ship))
    expect(result.details).toBe(formatMothershipShipIssues(ship))
    expect(result.details).not.toBe('ship')
    expect(result.secondary).toBe('J3C-V Troopship')
  })

  it('contains all 100 supplied issues with major rules text omitted', () => {
    expect(mothershipShipMinorIssues).toHaveLength(69)
    expect(mothershipShipMajorIssues).toHaveLength(31)
    expect(new Set([...mothershipShipMinorIssues, ...mothershipShipMajorIssues]).size).toBe(100)
    expect(mothershipShipMajorIssues).toContain(
      'Counterfeit papers. Ship is stolen. There is a bounty on it.',
    )
    expect(mothershipShipMajorIssues.join(' ')).not.toMatch(
      /\bd\d+|[+-]\d|\d+%|\[-\]|MDMG|Radiation Level|range band/,
    )
  })
})
