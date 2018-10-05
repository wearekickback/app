export function pluralize(str, value) {
  return 1 === value ? str : `${str}s`
}
