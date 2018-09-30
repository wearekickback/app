import _ from 'lodash'
import { Observable, ApolloLink } from 'apollo-link'
import { hasDirectives, checkDocument, removeDirectivesFromDocument } from 'apollo-utilities'

import { SIGN_IN } from '../../modals'
import { UserProfileQuery } from '../queries'
import { getProvider as getGlobalProvider } from '../../GlobalState'
import { getAccount } from '../../api/web3'

const sanitizedQueryCache = new Map()

const getAuthHeaders = token => {
  return token ? {
    Authorization: `Bearer ${token}`
  } : {}
}

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

      // if user logged in
      if (globalProvider.isLoggedIn()) {
        // add auth headers
        operation.setContext({
          headers: getAuthHeaders(globalProvider.authToken())
        })
      } else {
        try {
          // let's request user's profile
          const address = await getAccount()

          // cannot proceed if we do not have account address
          if (!address) {
            return makeError(observer, 'Web3 not yet connected!')
          }

          console.debug(`Checking if user is logged in ...`)

          const result = await globalProvider.apolloClient().query({
            query: UserProfileQuery,
            variables: { address },
            context: {
              headers: getAuthHeaders(globalProvider.authToken())
            }
          })

          const hasProfile = !!_.get(result, 'data.profile.social.length')
          const hasValidLoginToken = !!_.get(result, 'data.profile.legal.length')

          // logged in
          if (hasValidLoginToken && hasProfile) {
            console.debug('User is logged in and has a profile')

            globalProvider.setLoggedIn(true)
          } else {
            console.debug('User is not logged and/or does not have a profile')

            await globalProvider.signIn()
          }
        } catch (err) {
          return makeError(observer, err.message)
        }
      }

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
