import { mothershipShipClasses, type MothershipShipClassId } from '@/data/mothership-ship-classes'
import { mothershipShipMajorIssues, mothershipShipMinorIssues } from '@/data/mothership-ship-issues'
import { p } from '@/helper/prob'
import { randomFrom } from '@/helper/randomFrom'

export interface MothershipShip {
  shipClass: MothershipShipClassId
  jumpRating: 1 | 2 | 3
  shipType: string
  maintenanceIssues: string[]
  majorIssue?: string
}

export function rollMothershipShip(): MothershipShip {
  const shipClass = randomFrom(mothershipShipClasses)
  const jumpRating = randomFrom([1, 2, 3] as const)
  const shipType = randomFrom(shipClass.examples)
  const issueCount = randomFrom([1, 2])
  const availableIssues = [...mothershipShipMinorIssues]
  const maintenanceIssues = Array.from({ length: issueCount }, () => {
    const issue = randomFrom(availableIssues)
    availableIssues.splice(availableIssues.indexOf(issue), 1)
    return issue
  })
  return {
    shipClass: shipClass.id,
    jumpRating,
    shipType,
    maintenanceIssues,
    majorIssue: p(0.2) ? randomFrom(mothershipShipMajorIssues) : undefined,
  }
}

export function formatMothershipShipClass(ship: MothershipShip): string {
  return `J${ship.jumpRating}C-${ship.shipClass} ${ship.shipType}`
}

export function formatMothershipShipIssues(ship: MothershipShip): string {
  return [
    ...ship.maintenanceIssues,
    ...(ship.majorIssue ? [`Major issue: ${ship.majorIssue}`] : []),
  ].join(' ')
}
