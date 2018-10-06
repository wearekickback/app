import _ from 'lodash'

const mappings = {
  Party: 'address',
  Participant: 'user.address',
  SocialMedia: 'type',
}

export const dataIdFromObject = o => {
  const { __typename: type } = o

  const id = _.get(o, mappings[type]) || JSON.stringify(o)

  return `${type}:${id}`
}
