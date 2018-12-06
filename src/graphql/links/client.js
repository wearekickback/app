import { withClientState } from 'apollo-link-state'

import resolvers, { defaults } from '../../api/rootResolver'
import typeDefs from '../schema'

export default ({ cache }) =>
  withClientState({
    resolvers,
    cache,
    defaults,
    typeDefs
  })
