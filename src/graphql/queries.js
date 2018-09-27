import gql from 'graphql-tag'

export const EthersQuery = gql`
  query ethers {
    ethers @client {
      ethers
    }
  }
`

export const PartyQuery = gql`
  query getParty($address: String) {
    party(address: $address) @client {
      # hardcoded in events.json
      description
      date
      location
      # From Contract
      owner
      name
      attendees
      deposit
      limitOfParticipants
      registered
      attended
      ended
      cancelled
      endedAt
      coolingPeriod
      payoutAmount
      encryption
      participants {
        participantName
        address
        attended
        paid
      }
    }
  }
`

export const AllPartiesQuery = gql`
  query getParties {
    parties @client {
      name
      address
    }
  }
`
export const AllEventsQuery = gql`
  query getEvents {
    events @client {
      name
      address
    }
  }
`

export const GET_MARKED_ATTENDED = gql`
  query getMarkedAttended {
    markedAttendedList
  }
`
