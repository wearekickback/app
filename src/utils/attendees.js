import { addressesMatch } from './strings'

export const amAttendee = (attendees, address) => attendees.find(a => addressesMatch(a.user.address, address))
