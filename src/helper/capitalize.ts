export const capitalize = (str: string): string =>
  str.length ? str.charAt(0).toUpperCase() + str.substring(1) : ''
