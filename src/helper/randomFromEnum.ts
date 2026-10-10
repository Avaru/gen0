import { randomFrom } from './randomFrom'

export const randomFromEnum = <T extends Record<string, string>>(values: T): T[keyof T] =>
  randomFrom(Object.values(values)) as T[keyof T]
