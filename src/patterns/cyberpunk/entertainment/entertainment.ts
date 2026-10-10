import type { GenerationOptions } from '@/generator/options'
import Bits from '@/builders/Bits'
import { p } from '@/helper/prob'
import { load, SHADOWRUN } from '@/load'
import { type Generated } from '@/patterns/types'
import { givenName } from '../_secondary/names'

export const movies = async (options: GenerationOptions = {}): Promise<Generated> => {
  const movie = new Bits(await load(SHADOWRUN.MOVIE, options))

  let primary = ''

  if (p(0.25)) {
    primary += movie.tag('character-start').pick.uc + movie.tag('character-end').pick.lc
    primary += p(0.25) ? ' ' + movie.tag('title-object').pick.value : ''
  } else if (p(0.33)) {
    primary += p(0.33) ? movie.tag('title-prefix').pick.uc + ' ' : ''
    primary += movie.tag('title-subject').pick.uc
    primary += p(0.33) ? ' ' + movie.tag('title-object').pick.uc : ''
  } else {
    primary += p(0.33) ? movie.tag('subject').pick.uc + ' ' : ''
    if (p()) {
      primary += primary
        ? movie.tag('title-subject').pick.value
        : movie.tag('title-subject').pick.uc
    } else {
      primary += await givenName(options)
    }
    primary += ' '
    primary += p(0.33) ? movie.tag('title-object').pick.uc + ' ' : ''
  }
  primary += p(0.6) ? ' ' + movie.tag('title-suffix').pick.value : ''

  const details = [movie.tag('genre').pick.uc, movie.tag('meta').pick.value]
  if (p(0.1)) details.push(movie.tag('meta').pick.value)

  return {
    primary,
    details: details.join(', '),
  }
}
