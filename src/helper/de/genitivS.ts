export const genitivS = (str: string, isEnglish = false) =>
  str + (str && str.slice(-1).toLowerCase() === 's' ? "'" : isEnglish ? "'s" : 's')
