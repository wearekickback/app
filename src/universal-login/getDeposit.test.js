import { AddressZero } from 'ethers/constants'
import { utils } from 'ethers'
import EthConference from '@wearekickback/contracts/build/contracts/EthConference.json'
import ERC20Conference from '@wearekickback/contracts/build/contracts/ERC20Conference.json'
import { deployContract, getWallets, createMockProvider } from 'ethereum-waffle'
import Token from '@universal-login/commons/lib/contracts/Token.json'
import { getDeposit } from '.'

describe('getDeposit', () => {
  const provider = createMockProvider()
  const [wallet] = getWallets(provider)

  it('eth conference', async () => {
    const deposit = 1000
    const ethConference = await deployContract(wallet, EthConference, [
      'eth conference',
      deposit,
      20,
      100,
      wallet.address
    ])
    expect(await ethConference.tokenAddress()).toEqual(AddressZero)
    expect(await getDeposit(ethConference.address, provider)).toEqual(
      utils.bigNumberify(deposit)
    )
  })

  it('erc20 conference', async () => {
    const deposit = 1000
    const erc20 = await deployContract(wallet, Token)
    const erc20Conference = await deployContract(wallet, ERC20Conference, [
      'erc20 conference',
      deposit,
      20,
      100,
      wallet.address,
      erc20.address
    ])
    expect(await erc20Conference.tokenAddress()).toEqual(erc20.address)
    expect(await getDeposit(erc20Conference.address, provider)).toEqual(0)
  })
})
