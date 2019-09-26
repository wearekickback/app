import { Contract, utils } from 'ethers'
import { ETHER_NATIVE_TOKEN } from '@universal-login/commons'
import { EMPTY_ADDRESS } from '../api/utils'
import AbstractConference from '@wearekickback/contracts/build/contracts/AbstractConference.json'
import Token from '@universal-login/commons/lib/contracts/Token.json'

export const getDeposit = async (contractAddress, provider) => {
  const contract = new Contract(
    contractAddress,
    AbstractConference.abi,
    provider
  )
  if (await isERC20Conference(contract)) {
    return 0
  } else {
    return contract.deposit()
  }
}

export const isERC20Conference = async contract => {
  const tokenAddress = await contract.tokenAddress()
  return tokenAddress && tokenAddress !== EMPTY_ADDRESS
}

export const registerToEvent = async (
  applicationWallet,
  contractAddress,
  deposit,
  universalLoginSdk
) => {
  const registerData = new utils.Interface(
    AbstractConference.abi
  ).functions.register.encode([])
  const registerMessage = {
    gasToken: ETHER_NATIVE_TOKEN.address,
    to: contractAddress,
    from: applicationWallet.contractAddress,
    gasLimit: utils.bigNumberify('500000'),
    gasPrice: utils.bigNumberify('9000000'),
    data: registerData,
    value: deposit
  }
  const { waitToBeSuccess } = await universalLoginSdk.execute(
    registerMessage,
    applicationWallet.privateKey
  )
  const messageStatus = await waitToBeSuccess()
  return messageStatus.transactionHash
}

export const approveToken = async (
  applicationWallet,
  contractAddress,
  deposit,
  universalLoginSdk,
  tokenAddress
) => {
  const approveData = new utils.Interface(Token.abi).functions.approve.encode([
    contractAddress,
    deposit
  ])
  const approveMessage = {
    gasToken: ETHER_NATIVE_TOKEN.address,
    to: tokenAddress,
    from: applicationWallet.contractAddress,
    gasLimit: utils.bigNumberify('500000'),
    gasPrice: utils.bigNumberify('9000000'),
    data: approveData,
    value: 0
  }
  const { waitToBeSuccess } = await universalLoginSdk.execute(
    approveMessage,
    applicationWallet.privateKey
  )
  const messageStatus = await waitToBeSuccess()
  return messageStatus.transactionHash
}
