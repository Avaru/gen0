import { rng } from '@/helper/rng'

/** 80% ages 18–42, 18% ages 16–17 or 43–49, 2% ages 14–15 or 50–80. */
export function runnerAge(): number {
  const draw = rng()
  if (draw < 0.8) return 18 + Math.floor(rng() * 25)

  if (draw < 0.98) {
    const offset = Math.floor(rng() * 9)
    return offset < 2 ? 16 + offset : 41 + offset
  }

  const offset = Math.floor(rng() * 33)
  return offset < 2 ? 14 + offset : 48 + offset
}
