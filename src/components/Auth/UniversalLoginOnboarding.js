import React from 'react'
import { Onboarding } from '@universal-login/react'
import UniversalLoginSDK from '@universal-login/sdk'

const UniversalLoginOnboarding = () => {
  const sdk = new UniversalLoginSDK(
    'https://relayer-rinkeby.herokuapp.com',
    'https://rinkeby.infura.io'
  )

  return (
    <div>
      <Onboarding
        sdk={sdk}
        onConnect={() => {}}
        onCreate={() => {
          console.log('created')
        }}
        domains={['poppularapp.test']}
      />
    </div>
  )
}

export default UniversalLoginOnboarding
