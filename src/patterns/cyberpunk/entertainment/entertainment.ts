import { capitalize, lowercaseFirst } from '@/helper/capitalize'
import type { GenerationOptions } from '@/generator/options'
import Bits from '@/builders/Bits'
import { p } from '@/helper/prob'
import { load, SHADOWRUN } from '@/load'
import { type Generated } from '@/patterns/types'
import { givenName } from '../_secondary/names'

export const movies = (options: GenerationOptions = {}): Generated => {
  const movie = new Bits(load(SHADOWRUN.MOVIE, options))

  let primary = ''

  if (p(0.25)) {
    primary +=
      capitalize(movie.tag('character-start').take().value) +
      lowercaseFirst(movie.tag('character-end').take().value)
    primary += p(0.25) ? ' ' + movie.tag('title-object').take().value : ''
  } else if (p(0.33)) {
    primary += p(0.33) ? capitalize(movie.tag('title-prefix').take().value) + ' ' : ''
    primary += capitalize(movie.tag('title-subject').take().value)
    primary += p(0.33) ? ' ' + capitalize(movie.tag('title-object').take().value) : ''
  } else {
    primary += p(0.33) ? capitalize(movie.tag('subject').take().value) + ' ' : ''
    if (p()) {
      primary += primary
        ? movie.tag('title-subject').take().value
        : capitalize(movie.tag('title-subject').take().value)
    } else {
      primary += givenName(options)
    }
    primary += ' '
    primary += p(0.33) ? capitalize(movie.tag('title-object').take().value) + ' ' : ''
  }
  primary += p(0.6) ? ' ' + movie.tag('title-suffix').take().value : ''

  const details = [capitalize(movie.tag('genre').take().value), movie.tag('meta').take().value]
  if (p(0.1)) details.push(movie.tag('meta').take().value)

  return {
    primary,
    details: details.join(', '),
  }
}
