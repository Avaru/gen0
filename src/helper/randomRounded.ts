import { rng } from './rng'

export const randomRounded = (min: number, max: number): number => {
  let pop = Math.round(min + rng() * (max - min))

  switch (true) {
    case pop > 1000000:
      pop = Math.round(pop / 100000) * 100000
      break
    case pop > 100000:
      pop = Math.round(pop / 10000) * 10000
      break
    case pop > 25000:
      pop = Math.round(pop / 5000) * 5000
      break
    case pop > 5000:
      pop = Math.round(pop / 1000) * 1000
      break
    case pop > 500:
      pop = Math.round(pop / 100) * 100
      break
    case pop > 50:
      pop = Math.round(pop / 10) * 10
      break
    default:
      break
  }
  return Math.max(min, Math.min(max, pop))
}
