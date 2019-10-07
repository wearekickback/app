import { ETHER_NATIVE_TOKEN } from '@universal-login/commons'
import UniversalLoginSdk from '@universal-login/sdk'
import * as LocalStorage from '../api/localStorage'
import { utils, Wallet } from 'ethers'
import { ENV } from '../config'

const network = ENV === 'live' ? 'mainnet' : ENV

const applicationInfo = {
  applicationName: 'Kickback',
  logo: 'none',
  type: 'laptop'
}

export const universalLoginSdk = new UniversalLoginSdk(
  `https://relayer-${network}.universallogin.io`,
  `https://${network}.infura.io/v3/b3026fc5137a4bd18e5d5906ed49f77d`,
  {
    observedTokensAddresses: [ETHER_NATIVE_TOKEN.address]
  },
  {
    applicationInfo
  }
)

const startUniversalLoginSDK = () => universalLoginSdk.start()

startUniversalLoginSDK()

export const ensDomains =
  network === 'mainnet' ? ['unitest.eth'] : ['poppularapp.test']

const STORAGE_KEY = 'universalLoginWallet'

export const saveApplicationWallet = wallet => {
  const publicKey = new Wallet(wallet.privateKey).address
  LocalStorage.setItem(STORAGE_KEY, {
    privateKey: wallet.privateKey,
    contractAddress: wallet.contractAddress,
    name: wallet.name,
    publicKey
  })
}

export const getApplicationWallet = () => {
  return LocalStorage.getItem(STORAGE_KEY)
}

let USING_UNIVERSAL_LOGIN = false

export const isUsingUniversalLogin = () => USING_UNIVERSAL_LOGIN

export const useUniversalLogin = () => (USING_UNIVERSAL_LOGIN = true)

export const signString = (stringToSign, privateKey) => {
  const signingKey = new utils.SigningKey(privateKey)
  const hash = utils.hexlify(utils.toUtf8Bytes(stringToSign))
  const signature = signingKey.signDigest(
    utils.hashMessage(utils.arrayify(hash))
  )
  return utils.joinSignature(signature)
}

export { getDeposit, registerToEvent, approveToken } from './rsvp'
