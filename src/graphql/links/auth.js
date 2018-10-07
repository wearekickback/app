import { Observable, ApolloLink } from 'apollo-link'
import { hasDirectives, checkDocument, removeDirectivesFromDocument } from 'apollo-utilities'

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

export default () => (
  new ApolloLink((operation, forward) => {
    // if no @auth directive then nothing further to do!
    if (!hasDirectives(['auth'], operation.query)) {
      return forward(operation)
    }

    // get sanitized query (remove @auth directive since server won't understand it)
    let sanitizedQuery = sanitizedQueryCache[JSON.stringify(operation.query)]
    if (!sanitizedQuery) {
      // remove directives (inspired by https://github.com/apollographql/apollo-link-state/blob/master/packages/apollo-link-state/src/utils.ts)
      checkDocument(operation.query)
      sanitizedQuery = removeDirectivesFromDocument( [{ name: 'auth' }], operation.query)
      // save to cache for next time!
      sanitizedQueryCache[JSON.stringify(operation.query)] = sanitizedQuery
    }

    // overwrite original query with sanitized version
    operation.query = sanitizedQuery

    // build handler
    return new Observable(async observer => {
      let handle

      const globalProvider = await getGlobalProvider()

      // if user is not logged in
      if (!globalProvider.isLoggedIn()) {
        try {
          await globalProvider.signIn()
        } catch (err) {
          return makeError(observer, err.message)
        }
      }

      // add auth headers (by this point we should have them!)
      operation.setContext({
        headers: buildAuthHeaders(globalProvider.authToken())
      })

      // pass request down the chain
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
    })
  })
)
