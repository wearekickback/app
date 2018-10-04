const typeDefs = `
  # Root resolver
  type Web3 {
    accounts: [String]
  }

  type Transaction {
    id: String
    createdAt: String
  }

  type Query {
    web3: Web3
    party: Party
  }

  type Participant {
    participantName: String
    address: String,
    attended: Boolean,
    paid: Boolean
  }

  type Party {
    name: String
    deposit: Int
    limitOfParticipants: Int
    registered: Int
    attended: Int
    ended: Boolean
    cancelled: Boolean
    endedAt: Int
    coolingPeriod: Int
    payoutAmount: Int
    encryption: String
    participants: [Participant]
  }

  enum LegalAgreementType {
    TERMS_AND_CONDITIONS
    PRIVACY_POLICY
  }

  type EmailSettings {
    verified: String
    pending: String
  }

  type LegalAgreement {
    type: LegalAgreementType!
    accepted: String!
  }

  input LegalAgreementInput {
    type: LegalAgreementType!
    accepted: Int!
  }

  input SocialMediaInput {
    type: String!
    value: String!
  }

  type SocialMedia {
    type: String!
    value: String!
  }

  input UserProfileInput {
    email: String
    social: [SocialMediaInput]
    legal: [LegalAgreementInput]
  }
`

export default typeDefs
