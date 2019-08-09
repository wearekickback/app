import UniversalLoginSdk from '@universal-login/sdk'
import * as LocalStorage from '../api/localStorage'
import { utils, Wallet } from 'ethers'

export const universalLoginSdk = new UniversalLoginSdk(
  // TODO: GET NETWORK FROM CONFIG
  'https://relayer-rinkeby.herokuapp.com',
  'https://rinkeby.infura.io'
)

const STORAGE_KEY = 'universalLoginWallet'

export const saveApplicationWallet = wallet => {
  const publicKey = new Wallet(wallet.privateKey).address
  LocalStorage.setItem(STORAGE_KEY, {
    privateKey: wallet.privateKey,
    contractAddress: publicKey,
    ensName: wallet.ensName
  })
}

export const getApplicationWallet = () => {
  return LocalStorage.getItem(STORAGE_KEY)
}

let USING_UNIVERSAL_LOGIN = false

export const isUsingUniversalLogin = () => USING_UNIVERSAL_LOGIN

export const useUniversalLogin = () => (USING_UNIVERSAL_LOGIN = true)

export const signMessage = (payload, privateKey) => {
  const signingKey = new utils.SigningKey(privateKey)
  const signature = signingKey.signDigest(utils.hashMessage(payload))
  return utils.joinSignature(signature)
}
