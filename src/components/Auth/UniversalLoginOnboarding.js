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
        <div>
          <p style={{ color: 'white', fontSize: 20, textAlign: 'center' }}>
            Create or connect account
          </p>
          <p style={{ color: 'white', fontSize: 15 }}>
            Type a nickname you want
          </p>
          <Onboarding
            sdk={universalLoginSdk}
            onConnect={() => {}}
            onCreate={wallet =>
              onCreate(wallet, showModal, closeModal, reloadUserAddress)
            }
            domains={['unitest.eth']}
          />
        </div>
      )}
    </GlobalConsumer>
  )
}

export default UniversalLoginOnboarding
