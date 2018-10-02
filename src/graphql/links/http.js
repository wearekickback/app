import { HttpLink } from 'apollo-link-http'

import { API_URL } from '../../config'

export default () => new HttpLink({ uri: `${API_URL}/graphql` })
