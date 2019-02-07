import format from 'date-fns/format'

export const toPrettyDate = strOrDate =>
  format(new Date(strOrDate), 'MMM Do, YYYY @ H:mm a')
