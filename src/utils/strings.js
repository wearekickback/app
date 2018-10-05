export function pluralize(str, value) {
  return 1 === value ? str : `${str}s`
}

export function addressesMatch(str1, str2) {
  return (typeof str === 'string') && (typeof str2 === 'string')
    && str1 && str2
    && str1.toLowerCase() === str2.toLowerCase()
}
