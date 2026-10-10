import { capitalize } from '@/helper/capitalize'
import { randomGenus } from '@/helper/randomGenus'
import { randomFrom } from '@/helper/randomFrom'
import type { BitFilter, RawBit } from './types'
import { GENUS } from './types'

// Each pool owns its picks; filtering never consumes the original data.
export default class Bits {
  private bits: RawBit[]
  constructor(bits: readonly RawBit[], filter?: BitFilter) {
    this.bits = Bits.filterList(bits, filter)
  }

  static filterList(list: readonly RawBit[], filter: BitFilter = {}): RawBit[] {
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

  filter(filter: BitFilter): Bits {
    return new Bits(this.bits, filter)
  }
  tag(tag: string): Bits {
    return this.filter({ tag })
  }
  genus(genus: GENUS): Bits {
    return this.filter({ genus })
  }
  type(type: string): Bits {
    return this.filter({ type })
  }
  get count(): number {
    return this.bits.length
  }
  get values(): string[] {
    return this.bits.map((bit) => bit.value)
  }
  get pick(): Pick {
    const bit = randomFrom(this.bits)
    this.bits.splice(this.bits.indexOf(bit), 1)
    return new Pick(bit)
  }
}

export class Pick {
  constructor(public pick: RawBit) {}
  get uc(): string {
    return capitalize(this.pick.value)
  }
  get lc(): string {
    return this.pick.value.charAt(0).toLowerCase() + this.pick.value.substring(1)
  }
  get value(): string {
    return this.pick.value
  }
  get shortValue(): string {
    return this.pick.shortValue ?? this.pick.value
  }
  get genus(): GENUS {
    return (this.pick.genus as GENUS) ?? randomGenus()
  }
  get tags(): string[] {
    return this.pick.tags
  }
}
