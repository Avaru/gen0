import { p } from './prob'
import { rng } from './rng'

export const randomAge = ({ MIN = 5, MAX = 75, youngProbability = 0.5 } = {}): number =>
  Math.round(MIN + rng() * (p(youngProbability) ? rng() : 1) * (MAX - MIN))
