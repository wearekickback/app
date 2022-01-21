import moment from 'moment-timezone'

export const toPrettyDate = (strOrDate, timezone = '') => {
  return (
    moment.utc(strOrDate).format('MMM Do, YYYY @ H:mm a') +
    ' ' +
    moment()
      .tz(timezone)
      .format('zZ')
  )
}

export const getDayAndTimeFromDate = isoString => {
  const date = new Date(isoString)
  const hours = date.getUTCHours() * 60 * 60 * 1000
  const minutes = date.getUTCMinutes() * 60 * 1000
  const day = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
  ).setHours(0, 0, 0)

  return [day, hours + minutes]
}

export const getDateFromDayAndTime = (dayUTCString, time) => {
  const day = new Date(dayUTCString)
  const utc = Date.UTC(day.getFullYear(), day.getMonth(), day.getDate())
  const date = new Date(utc + time)
  return date
}

export function getLocalTimezoneOffset() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

export function getHours(utcString) {
  return moment.utc(utcString).format('H:mm a')
}

export const getUtcDateFromTimezone = (dateString, timezone = '') => {
  const timezoneDateString =
    dateString.replace('.000Z', '') +
    moment()
      .tz(timezone)
      .format('Z')
  return moment.utc(timezoneDateString).format('YYYYMMDDTHHmmssZ')
}

export const getDateFromUnix = unixtimesamp => {
  return moment(new Date(unixtimesamp * 1000)).format('MMM Do, YYYY')
}
