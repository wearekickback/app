import { ApolloLink } from 'apollo-link'

import client from './client'
import auth from './auth'
import upload from './upload'

export default args => ApolloLink.from([auth(args), client(args), upload])
