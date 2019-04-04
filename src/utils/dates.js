import moment from 'moment'

export const toPrettyDate = strOrDate =>
  moment(strOrDate).format('MMM Do, YYYY @ H:mm a')

export const getDayAndTimeFromDate = isoString => {
  const date = new Date(isoString)
  const hours = date.getUTCHours() * 60 * 60 * 1000
  const minutes = date.getUTCMinutes() * 60 * 1000
  const day = date.setHours(0, 0, 0, 0)
  return [day, hours + minutes]
}

export const getDateFromDayAndTime = (day, time) => {
  const utc = Date.UTC(day.getFullYear(), day.getMonth(), day.getDay())
  const date = new Date(utc + time)
  return date.toUTCString()
}

export function getLocalTimezoneOffset() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}
