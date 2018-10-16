import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import { findDOMNode } from 'react-dom'

import SafeMutation from '../SafeMutation'
import ErrorBox from '../ErrorBox'
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

        ReactTooltip.show(findDOMNode(this.btn))

        return signChallengeString({
          variables: {
            challengeString: str
          }
        })
      })
      .then(({ errors, data }) => {
        ReactTooltip.hide(findDOMNode(this.btn))

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

  _onRef = elem => {
    this.btn = elem
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
                    <Button
                      onClick={() => onClick(this.buildCallback({
                        userAddress,
                        createLoginChallenge,
                        signChallengeString,
                        setAuthTokenFromSignature,
                        setUserProfile,
                        onClick,
                      }))}
                      ref={this._onRef}
                      data-tip='Please sign the login message using your wallet or Dapp browser'
                    >
                      {title || 'Sign in'}
                      <ReactTooltip
                        place="top"
                        event="dblclick"
                        effect="solid"
                        type="dark"
                      />
                    </Button>
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
