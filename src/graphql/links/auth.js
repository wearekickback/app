import { Observable, Operation, ApolloLink } from 'apollo-link'
import { hasDirectives, checkDocument, removeDirectivesFromDocument } from 'apollo-utilities'

import { GetMyProfileNoAuth } from '../queries'
import { getProvider as getGlobalProvider } from '../../GlobalState'


const sanitizedQueryCache = new Map()

const getAuthHeaders = auth => {
  return auth ? {
    Authorization: `Bearer ${auth.token}`
  } : {}
}

export default () => (
  new ApolloLink((operation, forward) => {
    // need auth directive
    if (!hasDirectives(['auth'], operation.query)) {
      return forward(operation)
    }

    // get sanitized query (remove directive)
    let sanitizedQuery = sanitizedQueryCache[operation.query]
    if (!sanitizedQuery) {
      // remove directives (inspired by https://github.com/apollographql/apollo-link-state/blob/master/packages/apollo-link-state/src/utils.ts)
      checkDocument(operation.query)
      sanitizedQuery = removeDirectivesFromDocument( [{ name: 'auth' }], operation.query)
      // save to cache for next time!
      sanitizedQueryCache[operation.query] = sanitizedQuery
    }

    // overwrite original query with sanitized version
    operation.query = sanitizedQuery

    // build handler
    return new Observable(async observer => {
      let handle

      // if user already logged in then set headers
      const { auth } = (await getGlobalProvider()).state
      if (auth.userAddress) {
        operation.setContext({
          headers: getAuthHeaders(auth)
        })
      } else {
        console.log('wait')
        await new Promise(r => setTimeout(r, 4000))
      }

      // pass request down the chain
      operation.query = sanitizedQuery
      handle = forward(operation).subscribe({
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer),
      })

      // return unsubscribe function
      return () => {
        if (handle) {
          handle.unsubscribe()
        }
      }
      // // else let's request user's profile to see if they are logged in and have a profile
      // const result = await client.request({
      //   query: GetMyProfileNoAuth,
      //   context: {
      //     headers: getAuthHeaders()
      //   }
      // })
    })
  })
)
