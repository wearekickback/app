import format from 'date-fns/format'

export const toPrettyDate = strOrDate =>
  format(new Date(strOrDate), 'MMM Do, YYYY @ H:mm a')

export const getDayAndTimeFromDate = isoString => {
  const date = new Date(isoString)
  const hours = date.getHours() * 60 * 60 * 1000
  const minutes = date.getMinutes() * 60 * 1000
  const day = date.setHours(0, 0, 0, 0)
  return [day, hours + minutes]
}

export const getDateFromDayAndTime = (day, time) => {
  return new Date(new Date(day).setHours(0, 0, 0, 0) + time)
}
