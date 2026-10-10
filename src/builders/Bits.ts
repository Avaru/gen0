import { randomFrom } from '@/helper/randomFrom'
import type { BitFilter, RawBit, GENUS } from './types'

/** An independent selection pool. Filtering creates another independent pool. */
export default class Bits<Entry extends RawBit = RawBit> {
  private bits: Entry[]

  constructor(bits: readonly Entry[], filter: BitFilter<Entry> = {}) {
    this.bits = Bits.filterList(bits, filter)
  }

  static filterList<Entry extends RawBit>(
    list: readonly Entry[],
    filter: BitFilter<Entry> = {},
  ): Entry[] {
    return list
      .filter(
        (bit) =>
          (!filter.type || bit.type === filter.type) &&
          (!filter.tag || bit.tags.includes(filter.tag)) &&
          (!filter.not || !bit.tags.includes(filter.not)) &&
          (!filter.one || filter.one.some((tag) => bit.tags.includes(tag))) &&
          (!filter.all || filter.all.every((tag) => bit.tags.includes(tag))) &&
          (!filter.none || !filter.none.some((tag) => bit.tags.includes(tag))) &&
          (!filter.genus || bit.genus === filter.genus) &&
          (!filter.required || filter.required.every((key) => bit[key] !== undefined)),
      )
      .map((bit) => ({ ...bit, tags: [...bit.tags] }))
  }

  filter(filter: BitFilter<Entry>): Bits<Entry> {
    return new Bits(this.bits, filter)
  }
  tag(tag: string): Bits<Entry> {
    return this.filter({ tag })
  }
  genus(genus: GENUS): Bits<Entry> {
    return this.filter({ genus })
  }
  type(type: NonNullable<Entry['type']>): Bits<Entry> {
    return this.filter({ type })
  }
  get count(): number {
    return this.bits.length
  }
  get values(): string[] {
    return this.bits.map((bit) => bit.value)
  }

  /** Select and remove one entry from this pool, leaving its source untouched. */
  take(): Entry {
    const bit = randomFrom(this.bits)
    this.bits.splice(this.bits.indexOf(bit), 1)
    return bit
  }
}
