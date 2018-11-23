export const ensureInArray = (array, key, entry, updateExisting = false) => {
  let ret = [...(array || [])]

  const existing = ret.findIndex(v => v[key] === entry[key])

  if (0 <= existing) {
    if (updateExisting) {
      ret[existing] = { ...ret[existing], ...entry }
    }
  } else {
    ret.push(entry)
  }

  return ret
}

export const ensureNotInArray = (array, key, entry) => {
  return (array || []).filter(v => v[key] !== entry[key])
}
