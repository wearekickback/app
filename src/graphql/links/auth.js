import _ from 'lodash'
import { Observable, ApolloLink } from 'apollo-link'
import { hasDirectives, checkDocument, removeDirectivesFromDocument } from 'apollo-utilities'

import { SIGN_IN, SIGN_UP } from '../../modals'
import { UserProfileQuery } from '../queries'
import { getProvider as getGlobalProvider } from '../../GlobalState'
import { getAccount } from '../../api/web3'

const sanitizedQueryCache = new Map()

const getAuthHeaders = token => {
  return token ? {
    Authorization: `Bearer ${token}`
  } : {}
}

export default () => (
  new ApolloLink((operation, forward) => {
    // if no @auth directive then nothing further to do!
    if (!hasDirectives(['auth'], operation.query)) {
      return forward(operation)
    }

    // get sanitized query (remove @auth directive since server won't understand it)
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

      const globalProvider = await getGlobalProvider()

      // if user logged in
      if (globalProvider.isLoggedIn()) {
        // add auth headers
        operation.setContext({
          headers: getAuthHeaders(globalProvider.authToken())
        })
      } else {
        // let's request user's profile
        const address = await getAccount()

        // cannot proceed if we do not have account address
        if (!address) {
          observer.error(new Error('Web3 not yet connected!'))
          observer.complete()
          return
        }

        try {
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
          if (hasValidLoginToken) {
            if (hasProfile) {
              console.debug('User is logged in')
              globalProvider.setLoggedIn(true)
            } else {
              console.debug('User does not have a profile')
              globalProvider.showModal(SIGN_UP)
            }
          }
          // not logged in
          else {
            if (hasProfile) {
              console.debug('User is not logged in but has signed up before')
              globalProvider.showModal(SIGN_IN)
            } else {
              console.debug('User is not signed up')
              globalProvider.showModal(SIGN_UP)
            }
          }
        } catch (err) {
          console.warn(err)
          observer.error(new Error('Unable to check if user is logged in'))
          observer.complete()
          return
        }
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
    })
  })
)
