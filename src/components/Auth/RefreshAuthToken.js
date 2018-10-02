import React, { Component } from 'react'

import SafeMutation from '../SafeMutation'
import ErrorBox from '../ErrorBox'
import { CreateLoginChallenge, SignChallengeString } from '../../graphql/mutations'
import { GlobalConsumer } from '../../GlobalState'


export default class RefreshAuthToken extends Component {
  buildCallback = ({
    userAddress,
    createLoginChallenge,
    signChallengeString,
    setAuthTokenFromSignature,
    setUserProfile,
  }) => ({ fetchUserProfileFromServer }) => (
    createLoginChallenge()
      .then(({ data, errors }) => {
        if (errors) {
          throw new Error('Failed to obtain login challenge!')
        }

        const { challenge: { str } } = data

        return signChallengeString({
          variables: {
            challengeString: str
          }
        })
      })
      .then(({ errors, data }) => {
        if (errors) {
          throw new Error('Failed to obtain signature!')
        }

        const { signature } = data

        return setAuthTokenFromSignature(userAddress, signature)
      })
      .then(() => fetchUserProfileFromServer())
      .then(({ errors, data }) => {
        if (errors) {
          throw new Error('Failed to fetch user profile!')
        }

        const { profile } = data

        setUserProfile(profile)
      })
  )

  render() {
    return (
      <GlobalConsumer>
        {({ userAddress, setAuthTokenFromSignature, setUserProfile }) => (
          (!userAddress) ? (
            <ErrorBox>Please ensure you are connected to Ethereum!</ErrorBox>
          ) : (
            <SafeMutation mutation={CreateLoginChallenge} variables={{ address: userAddress }}>
              {createLoginChallenge => (
                <SafeMutation mutation={SignChallengeString}>
                  {signChallengeString => this.props.children(
                    this.buildCallback({
                      userAddress,
                      createLoginChallenge,
                      signChallengeString,
                      setAuthTokenFromSignature,
                      setUserProfile,
                    })
                  )}
                </SafeMutation>
              )}
            </SafeMutation>
          )
        )}
      </GlobalConsumer>
    )
  }
}
