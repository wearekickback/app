import { filterParticipants, sortParticipants } from './parties'
import { PARTICIPANT_STATUS } from '@wearekickback/shared'

describe('filterParticipants', () => {
  test('filter participants search username', () => {
    const participants = [
      {
        user: {
          realName: 'vitalik',
          username: 'vitalik',
          address: '123'
        }
      },
      {
        user: { realName: 'Mario', username: 'supermario', address: '456' }
      }
    ]

    expect(participants.filter(filterParticipants({}, 'super'))).toEqual([
      {
        user: {
          realName: 'Mario',
          username: 'supermario',
          address: '456'
        }
      }
    ])
  })

  test('filter participants search realname', () => {
    const participants = [
      {
        user: {
          realName: 'vitalik',
          username: 'vitalik',
          address: '123'
        }
      },
      {
        user: { realName: 'Mario', username: 'supermario', address: '456' }
      }
    ]

    expect(participants.filter(filterParticipants({}, 'vitalik'))).toEqual([
      {
        user: {
          realName: 'vitalik',
          username: 'vitalik',
          address: '123'
        }
      }
    ])
  })

  test('filter participants search address', () => {
    const participants = [
      {
        user: {
          realName: 'vitalik',
          username: 'vitalik',
          address: '123'
        }
      },
      {
        user: { realName: 'Mario', username: 'supermario', address: '456' }
      }
    ]

    expect(participants.filter(filterParticipants({}, '123'))).toEqual([
      {
        user: {
          realName: 'vitalik',
          username: 'vitalik',
          address: '123'
        }
      }
    ])
  })

  test('filter participants filters marked', () => {
    const participants = [
      {
        user: {
          realName: 'vitalik',
          username: 'vitalik',
          address: '123'
        },
        status: PARTICIPANT_STATUS.REGISTERED
      },
      {
        user: { realName: 'Mario', username: 'supermario', address: '456' },
        status: PARTICIPANT_STATUS.REGISTERED
      }
    ]

    expect(
      participants.filter(filterParticipants({ value: 'marked' }, ''))
    ).toEqual([])
  })

  test('filter participants filters marked', () => {
    const participants = [
      {
        user: {
          realName: 'vitalik',
          username: 'vitalik',
          address: '123'
        },
        status: PARTICIPANT_STATUS.SHOWED_UP
      },
      {
        user: { realName: 'Mario', username: 'supermario', address: '456' },
        status: PARTICIPANT_STATUS.REGISTERED
      }
    ]

    expect(
      participants.filter(filterParticipants({ value: 'marked' }, ''))
    ).toEqual([
      {
        user: {
          realName: 'vitalik',
          username: 'vitalik',
          address: '123'
        },
        status: PARTICIPANT_STATUS.SHOWED_UP
      }
    ])
  })

  test('filter participants filters unmarked', () => {
    const participants = [
      {
        user: {
          realName: 'vitalik',
          username: 'vitalik',
          address: '123'
        },
        status: PARTICIPANT_STATUS.SHOWED_UP
      },
      {
        user: { realName: 'Mario', username: 'supermario', address: '456' },
        status: PARTICIPANT_STATUS.SHOWED_UP
      }
    ]

    expect(
      participants.filter(filterParticipants({ value: 'unmarked' }, ''))
    ).toEqual([])
  })

  test('filter participants filters marked and search', () => {
    const participants = [
      {
        user: {
          realName: 'vitalik',
          username: 'vitalik',
          address: '123'
        },
        status: PARTICIPANT_STATUS.SHOWED_UP
      },
      {
        user: { realName: 'Mario', username: 'supermario', address: '456' },
        status: PARTICIPANT_STATUS.REGISTERED
      }
    ]

    expect(
      participants.filter(filterParticipants({ value: 'marked' }, 'super'))
    ).toEqual([])
  })

  test('filter participants filters marked and search', () => {
    const participants = [
      {
        user: {
          realName: 'vitalik',
          username: 'vitalik',
          address: '123'
        },
        status: PARTICIPANT_STATUS.SHOWED_UP
      },
      {
        user: { realName: 'Mario', username: 'supermario', address: '456' },
        status: PARTICIPANT_STATUS.REGISTERED
      },
      {
        user: { realName: 'Clark Kent', username: 'superman', address: '789' },
        status: PARTICIPANT_STATUS.SHOWED_UP
      }
    ]

    expect(
      participants.filter(filterParticipants({ value: 'marked' }, 'super'))
    ).toEqual([
      {
        user: { realName: 'Clark Kent', username: 'superman', address: '789' },
        status: PARTICIPANT_STATUS.SHOWED_UP
      }
    ])
  })
})

describe('sortParticipants', () => {
  test('sortParticipants sorts participants', () => {
    const participants = [
      {
        realName: 'Vitalik',
        index: 1
      },
      {
        realName: 'Mario',
        index: 0
      }
    ]

    expect(participants.sort(sortParticipants)).toEqual([
      {
        realName: 'Mario',
        index: 0
      },
      {
        realName: 'Vitalik',
        index: 1
      }
    ])
  })
})
