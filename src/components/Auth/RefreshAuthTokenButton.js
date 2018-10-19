import React, { Component } from 'react'

import SafeMutation from '../SafeMutation'
import ErrorBox from '../ErrorBox'
import Tooltip from '../Tooltip'
import Button from '../Forms/Button'
import { CreateLoginChallenge, SignChallengeString } from '../../graphql/mutations'
import { GlobalConsumer } from '../../GlobalState'


export default class RefreshAuthTokenButton extends Component {
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

        this.tooltip.show()

        return signChallengeString({
          variables: {
            challengeString: str
          }
        })
      })
      .then(({ errors, data }) => {
        this.tooltip.hide()

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
      .catch(err => {
        this.tooltip.hide()
        throw err
      })
  )

  _onTooltipRef = elem => {
    this.tooltip = elem
  }

  render() {
    const { onClick, title } = this.props

    return (
      <GlobalConsumer>
        {({ userAddress, setAuthTokenFromSignature, setUserProfile }) => (
          (!userAddress) ? (
            <ErrorBox>Please ensure you are connected to Ethereum!</ErrorBox>
          ) : (
            <SafeMutation mutation={CreateLoginChallenge} variables={{ address: userAddress }}>
              {createLoginChallenge => (
                <SafeMutation mutation={SignChallengeString}>
                  {signChallengeString => (
                    <Tooltip
                      text='Please sign the login message using your wallet or Dapp browser'
                      ref={this._onTooltipRef}
                    >
                      <Button
                        analyticsId='Sign Message'
                        onClick={() => onClick(this.buildCallback({
                          userAddress,
                          createLoginChallenge,
                          signChallengeString,
                          setAuthTokenFromSignature,
                          setUserProfile,
                          onClick,
                        }))}
                      >
                        {title || 'Sign in'}
                      </Button>
                    </Tooltip>
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
