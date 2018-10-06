module.exports = {
  PARTY_STATUS: {
    PENDING: 'pending',
    DEPLOYED: 'deployed',
  },
  PARTICIPANT_STATUS: {
    UNKNOWN: 'unknown',
    REGISTERED: 'registered',
    SHOWED_UP: 'showed_up',
    WITHDRAWN_PAYOUT: 'withdrawn_payout',
  },
  sanitizeStatus: s => s.toLowerCase(),
}
