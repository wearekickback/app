import { ApolloLink } from 'apollo-link'
import { createUploadLink } from 'apollo-upload-client'

import client from './client'
import http from './http'
import auth from './auth'

export default args =>
  ApolloLink.from([auth(args), client(args), http(args), createUploadLink()])
