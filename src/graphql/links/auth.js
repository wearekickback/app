import { Observable, ApolloLink } from 'apollo-link'
import {
  hasDirectives,
  checkDocument,
  removeDirectivesFromDocument
} from 'apollo-utilities'

import { getProvider as getGlobalProvider } from '../../GlobalState'
import { buildAuthHeaders } from '../../utils/requests'

const sanitizedQueryCache = new Map()

const makeError = (observer, err) => {
  // observer.next([{
  // result: {
  //   data: {},
  // },
  // errors: [ err ]
  //   }
  // ])
  observer.complete([])
}

export default () =>
  new ApolloLink((operation, forward) => {
    const requireAuth = hasDirectives(['requireAuth'], operation.query)
    const disableAuth = hasDirectives(['disableAuth'], operation.query)

    // get sanitized query (remove auth directives since server won't understand them)
    let sanitizedQuery = sanitizedQueryCache[JSON.stringify(operation.query)]
    if (!sanitizedQuery) {
      // remove directives (inspired by https://github.com/apollographql/apollo-link-state/blob/master/packages/apollo-link-state/src/utils.ts)
      checkDocument(operation.query)
      sanitizedQuery = removeDirectivesFromDocument(
        [{ name: 'requireAuth' }, { name: 'disableAuth' }],
        operation.query
      )
      // save to cache for next time!
      sanitizedQueryCache[JSON.stringify(operation.query)] = sanitizedQuery
    }
    // overwrite original query with sanitized version
    operation.query = sanitizedQuery

    // disable auth for this query?
    if (disableAuth) {
      return forward(operation)
    }

    // build handler
    return new Observable(async observer => {
      let handle

      // wait until global provider is ready
      const globalProvider = await getGlobalProvider()

      // if user is not logged in and we require auth
      if (!globalProvider.isLoggedIn() && requireAuth) {
        try {
          // try logging in
          await globalProvider.signIn()
        } catch (err) {
          return makeError(observer, err.message)
        }
      }

      // add auth headers if possible
      if (globalProvider.isLoggedIn()) {
        operation.setContext({
          headers: buildAuthHeaders(globalProvider.authToken())
        })
      }

      // pass request down the chain
      handle = forward(operation).subscribe({
        next: observer.next.bind(observer),
        error: observer.error.bind(observer),
        complete: observer.complete.bind(observer)
      })

      // return unsubscribe function
      return () => {
        if (handle) {
          handle.unsubscribe()
        }
      }
    })
  })
