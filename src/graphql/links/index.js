import { ApolloLink } from 'apollo-link'

import client from './client'
import http from './http'
import auth from './auth'

export default args => ApolloLink.from([
  client(args),
  auth(args),
  http(args)
])
