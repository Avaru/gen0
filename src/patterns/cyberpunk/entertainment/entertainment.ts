import { capitalize, lowercaseFirst } from '@/helper/capitalize'
import type { GenerationOptions } from '@/generator/options'
import Bits from '@/builders/Bits'
import { p } from '@/helper/prob'
import { load, DATA } from '@/builders/load'
import { type Generated } from '@/patterns/types'
import { givenName } from '../people/names'

export const movies = (options: GenerationOptions = {}): Generated => {
  const movie = new Bits(load(DATA.MOVIES, options))

  let primary = ''

  if (p(0.25)) {
    primary +=
      capitalize(movie.tag('character-start').take().value) +
      lowercaseFirst(movie.tag('character-end').take().value)
    primary += p(0.25) ? ' ' + movie.tag('title-object-end').take().value : ''
  } else if (p(0.33)) {
    let subjectTag = 'title-subject'
    if (p(0.33)) {
      const opening = movie
        .filter({
          one: ['title-prefix', 'title-object-start', 'title-prefix-action'],
        })
        .take()
      primary += capitalize(opening.value.trim())
      primary += opening.tags.includes('title-object-start') ? ' of the ' : ' '
      if (opening.tags.includes('title-prefix-action')) subjectTag = 'title-action'
    }
    primary += capitalize(movie.tag(subjectTag).take().value)
    primary += p(0.33) ? ' ' + movie.tag('title-object-end').take().value : ''
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
    primary += p(0.33) ? movie.tag('title-object-end').take().value + ' ' : ''
  }
  primary += p(0.2) ? ' ' + movie.tag('title-suffix').take().value : ''

  const details = [capitalize(movie.tag('genre').take().value), movie.tag('meta').take().value]
  if (p(0.1)) details.push(movie.tag('meta').take().value)

  return {
    primary: primary.replace(/\s+/g, ' ').trim(),
    details: details.join(', '),
  }
}
