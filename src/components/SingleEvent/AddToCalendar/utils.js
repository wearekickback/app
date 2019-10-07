import moment from 'moment'

export const CALENDARS = {
  GOOGLE: 'Google',
  ICAL: 'iCal',
  OUTLOOK: 'Outlook',
  YAHOO: 'Yahoo'
}

export const calculateDuration = (startTime, endTime) => {
  // snag parameters and format properly in UTC
  const end = moment.utc(endTime).format('DD/MM/YYYY HH:mm:ss')
  const start = moment.utc(startTime).format('DD/MM/YYYY HH:mm:ss')

  // calculate the difference in milliseconds between the start and end times
  const difference = moment(end, 'DD/MM/YYYY HH:mm:ss').diff(
    moment(start, 'DD/MM/YYYY HH:mm:ss')
  )

  // convert difference from above to a proper momentJs duration object
  const duration = moment.duration(difference)

  return Math.floor(duration.asHours()) + moment.utc(difference).format(':mm')
}

/**
 * Converts Date String with UTC timezone to date consumable by calendar
 * apps. Changes +00:00 to Z.
 * @param {string} date in YYYYMMDDTHHmmssZ format
 * @returns {string} Date with +00:00 replaced with Z
 */
export const formatDate = date => date && date.replace('+00:00', 'Z')

/**
 * Tests provided UserAgent against Known Mobile User Agents
 * @returns {bool} isMobileDevice
 */
export const isMobile = () =>
  /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(
    window.navigator.userAgent || window.navigator.vendor || window.opera
  )

/**
 * Tests userAgent to see if browser is IE
 * @returns {bool} isInternetExplorer
 */
export const isInternetExplorer = () =>
  /MSIE/.test(window.navigator.userAgent) ||
  /Trident/.test(window.navigator.userAgent)

/**
 * Takes an event object and returns a Google Calendar Event URL
 * @param {string} description
 * @param {string} endTime
 * @param {string} location
 * @param {string} startTime
 * @param {string} timezone
 * @param {string} title
 * @returns {string} Google Calendar Event URL
 */
const googleShareUrl = ({
  description,
  endTime,
  location,
  startTime,
  timezone,
  title
}) =>
  `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${startTime}/${endTime}${timezone &&
    `&ctz=${timezone}`}&location=${location}&text=${title}&details=${description}`

/**
 * Takes an event object and returns a Yahoo Calendar Event URL
 * @param {string} description
 * @param {string} duration
 * @param {string} location
 * @param {string} startTime
 * @param {string} title
 * @returns {string} Yahoo Calendar Event URL
 */
const yahooShareUrl = ({ description, duration, location, startTime, title }) =>
  `https://calendar.yahoo.com/?v=60&view=d&type=20&title=${title}&st=${startTime}&dur=${duration}&desc=${description}&in_loc=${location}`

/**
 * Takes an event object and returns an array to be downloaded as ics file
 * @param {string} description
 * @param {string} endTime
 * @param {string} location
 * @param {string} startTime
 * @param {string} timezone
 * @param {string} title
 * @returns {array} ICS Content
 */
const buildShareFile = ({
  description = '',
  endTime,
  location = '',
  startTime,
  timezone = '',
  title = ''
}) => {
  let content = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    `URL:${document.URL}`,
    'METHOD:PUBLISH',
    // TODO: Will need to parse the date without Z for ics
    // This means I'll probably have to require a date lib - luxon most likely or datefns
    timezone === ''
      ? `DTSTART:${startTime}`
      : `DTSTART;TZID=${timezone}:${startTime}`,
    timezone === '' ? `DTEND:${endTime}` : `DTEND;TZID=${timezone}:${endTime}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\n')

  return isMobile()
    ? encodeURI(`data:text/calendar;charset=utf8,${content}`)
    : content
}

/**
 * Takes an event object and a type of URL and returns either a calendar event
 * URL or the contents of an ics file.
 * @param {string} description
 * @param {string} endTime
 * @param {string} location
 * @param {string} startTime
 * @param {string} timezone
 * @param {string} title
 * @param {enum} type One of CALENDARS
 */
export const buildShareUrl = (
  {
    description = '',
    endTime,
    location = '',
    startTime,
    timezone = '',
    title = ''
  },
  type
) => {
  const encodeURI = type !== CALENDARS.ICAL && type !== CALENDARS.OUTLOOK

  const data = {
    description: encodeURI ? encodeURIComponent(description) : description,
    duration: calculateDuration(startTime, endTime),
    endTime: formatDate(endTime),
    location: encodeURI ? encodeURIComponent(location) : location,
    startTime: formatDate(startTime),
    timezone,
    title: encodeURI ? encodeURIComponent(title) : title
  }

  switch (type) {
    case CALENDARS.GOOGLE:
      return googleShareUrl(data)
    case CALENDARS.YAHOO:
      return yahooShareUrl(data)
    default:
      return buildShareFile(data)
  }
}
