export const capitalize = (str: string): string =>
  str.length ? str.charAt(0).toUpperCase() + str.substring(1) : ''

export const lowercaseFirst = (str: string): string =>
  str.length ? str.charAt(0).toLowerCase() + str.substring(1) : ''
