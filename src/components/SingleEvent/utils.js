export function winningShare(deposit, registered, attended) {
  return ((deposit * registered) / attended).toFixed(3)
}

export function plural(str, value) {
  return 1 === value ? str : `${str}s`
}
