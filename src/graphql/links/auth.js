import gql from 'graphql-tag'
import { Observable, ApolloLink } from 'apollo-link'
import { hasDirectives, checkDocument, removeDirectivesFromDocument } from 'apollo-utilities'

import { ProfileFields } from '../fragments'
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

const LoginUserNoAuth = gql`
  ${ProfileFields}

  mutation loginUser {
    profile: loginUser {
      ...ProfileFields
    }
  }
`

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
          // let's request user's profile
          const address = await getAccount()

          // cannot proceed if we do not have account address
          if (!address) {
            return makeError(observer, 'Web3 not yet connected!')
          }

          console.debug(`Checking if user is logged in ...`)

          try {
            const { data: { profile } } = await globalProvider.apolloClient().mutate({
              mutation: LoginUserNoAuth,
              context: {
                headers: getAuthHeaders(globalProvider.authToken())
              }
            })

            console.debug('User is logged in and has a profile')

            globalProvider.setUserProfile(profile)
          } catch (err) {
            console.debug('User is not logged and/or does not have a profile')

            await globalProvider.signIn()
          }
        } catch (err) {
          return makeError(observer, err.message)
        }
      }

      // add auth headers (by this point we should have them!)
      operation.setContext({
        headers: getAuthHeaders(globalProvider.authToken())
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
