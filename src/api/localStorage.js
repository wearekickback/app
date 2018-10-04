const localStorage = window.localStorage

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (_) {
    console.error(`Error writing to localStorage`, key, value)
  }
}

export function getItem(key) {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch (err) {
    return undefined
  }
}
