import { AddressZero } from 'ethers/constants'
import { utils } from 'ethers'
import chai, { expect } from 'chai'
import EthConference from '@wearekickback/contracts/build/contracts/EthConference.json'
import ERC20Conference from '@wearekickback/contracts/build/contracts/ERC20Conference.json'
import {
  solidity,
  deployContract,
  getWallets,
  createMockProvider
} from 'ethereum-waffle'
import Token from '@universal-login/commons/lib/contracts/Token.json'
import { registerToEvent, approveToken } from '.'
import { setupSdk } from '@universal-login/sdk/testutils'

jest.setTimeout(30000)
chai.use(solidity)

describe('registerToEvent', () => {
  let provider = createMockProvider()
  const [wallet, relayerWallet] = getWallets(provider)
  const deposit = 1000
  let sdk
  let relayer
  let applicationWallet

  beforeAll(async () => {
    ;({ sdk, relayer } = await setupSdk(relayerWallet))
    const futureWallet = await sdk.createFutureWallet()
    await wallet.sendTransaction({
      to: futureWallet.contractAddress,
      value: utils.parseEther('1.0')
    })
    const name = 'justyna.mylogin.eth'
    await futureWallet.deploy(name, '1', AddressZero)
    applicationWallet = {
      contractAddress: futureWallet.contractAddress,
      privateKey: futureWallet.privateKey,
      name
    }
  })

  afterAll(async () => {
    await relayer.stop()
  })

  it('register to eth conference', async () => {
    const ethConference = await deployContract(wallet, EthConference, [
      'eth conference',
      deposit,
      20,
      100,
      wallet.address
    ])
    await registerToEvent(
      applicationWallet,
      ethConference.address,
      deposit,
      sdk
    )
    expect(await provider.getBalance(ethConference.address)).to.eq(
      utils.bigNumberify(deposit)
    )
    expect(await ethConference.isRegistered(applicationWallet.contractAddress))
      .to.be.true
    const participant = await ethConference.participants(
      applicationWallet.contractAddress
    )
    expect(participant.paid).to.be.false
    expect(participant.index).to.eq(utils.bigNumberify(1))
  })

  it('register to erc20 conference', async () => {
    const erc20Token = await deployContract(relayerWallet, Token)
    const erc20Conference = await deployContract(wallet, ERC20Conference, [
      'erc20 conference',
      deposit,
      20,
      100,
      wallet.address,
      erc20Token.address
    ])
    await erc20Token.transfer(
      applicationWallet.contractAddress,
      utils.parseEther('1')
    )
    await approveToken(
      applicationWallet,
      erc20Conference.address,
      utils.bigNumberify(deposit),
      sdk,
      erc20Token.address
    )
    expect(
      await erc20Token.allowance(
        applicationWallet.contractAddress,
        erc20Conference.address
      )
    ).to.eq(utils.bigNumberify(deposit))

    await registerToEvent(
      applicationWallet,
      erc20Conference.address,
      utils.bigNumberify(0),
      sdk
    )

    expect(await provider.getBalance(erc20Conference.address)).to.eq(
      utils.bigNumberify(0)
    )
    expect(
      await erc20Conference.isRegistered(applicationWallet.contractAddress)
    ).to.be.true
  })
})
