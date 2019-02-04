import { withClientState } from 'apollo-link-state'

import resolvers, { defaults } from '../../api/rootResolver'

export default ({ cache }) =>
  withClientState({
    resolvers,
    cache,
    defaults
  })
