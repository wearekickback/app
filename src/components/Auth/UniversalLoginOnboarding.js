import React from 'react'
import { Onboarding } from '@universal-login/react'
import { universalLoginSdk, saveApplicationWallet } from '../../universal-login'
import { GlobalConsumer } from '../../GlobalState'
import { UNIVERSAL_LOGIN, SIGN_IN } from '../../modals'

const UniversalLoginOnboarding = () => {
  const onCreate = async (wallet, showModal, closeModal, reloadUserAddress) => {
    saveApplicationWallet(wallet)
    await reloadUserAddress(wallet.contractAddress)
    closeModal({ name: UNIVERSAL_LOGIN })
    showModal({ name: SIGN_IN })
  }

  return (
    <GlobalConsumer>
      {({ showModal, closeModal, reloadUserAddress }) => (
        <Onboarding
          sdk={universalLoginSdk}
          onConnect={() => {}}
          onCreate={wallet =>
            onCreate(wallet, showModal, closeModal, reloadUserAddress)
          }
          domains={['poppularapp.test']}
        />
      )}
    </GlobalConsumer>
  )
}

export default UniversalLoginOnboarding
