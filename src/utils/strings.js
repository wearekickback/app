export function pluralize(str, value) {
  return 1 === value ? str : `${str}s`
}

export function stringsMatch(str1, str2) {
  return (typeof str1 === 'string') && (typeof str2 === 'string')
    && str1.length
    && str1.toLowerCase() === str2.toLowerCase()
}

export function addressesMatch(addr1, addr2) {
  return stringsMatch(addr1, addr2)
}

export function statusesMatch(status1, status2) {
  return stringsMatch(status1, status2)
}

export function trimOrEmpty(str) {
  return (typeof str === 'string') ? str.trim() : ''
}

export function trimOrEmptyStringProps(stringProps) {
  return Object.keys(stringProps).reduce((m, k) => {
    m[k] = trimOrEmpty(stringProps[k])
    return m
  }, {})
}
