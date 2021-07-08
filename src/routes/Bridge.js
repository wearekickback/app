import React, { Component } from 'react'
import styled from '@emotion/styled'
import { IoReloadCircle } from 'react-icons/io5'

import Card from 'react-bootstrap/Card'
import Tabs from '../components/Tabs/Tabs'
import Button from '../components/Forms/Button'
import Loader from 'react-loader-spinner'
import colours from '../colours'

import * as Sdk from 'etherspot'
import * as ethers from 'ethers'

import detectEthereumProvider from '@metamask/detect-provider'

const tokenAbi = require('../api/abi/erc20ABI.json')
const tokenabiCoder = new ethers.utils.Interface(tokenAbi)
const erc20Abi = require('../api/abi/tokenBridgeContractDaiABI.json') // ERC20 ABI
const xdai_bridge_abi = require('../api/abi/tokenBridgexDaiABI.json')
const erc20Address = '0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016'
const abiCoder = new ethers.utils.Interface(erc20Abi)

const bridgeCard = styled('Card')`
  ${'' /* background: url(${backgroundDark}); */}
  text-align: center;
  ustify-content: center;
  align-items: center;
  justify-items: center;
  justify-self: center;
  align-self: center;
  display: flex;
  align-content: center;
  flex-direction: column;
  flex-wrap: nowrap;
`

const Tab1 = styled('div')`
  cursor: pointer;
  margin: 1rem;
  fontweight: 100;
`

const Tab2 = styled('div')`
  cursor: pointer;
  margin: 1rem;
`

const Input = styled('input')`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 40px;
  font-size: 14px;
  color: #1e1e1e;
  flex: 1;
  border-radius: 6px;
  border: 1px solid ${({ hasError }) => (hasError ? '#f00' : '#edeef4')};
  padding-left: ${p => (p.hasPrefix ? '27px' : '15px')};
  ${({ wide }) => wide && `width: 100%`};
  &:focus {
    outline: 0;
    border: 1px solid ${({ hasError }) => (hasError ? '#f00' : '#6e76ff')};
  }
  ::placeholder {
    color: #ccced8;
    opacity: 1; /* Firefox */
  }
`

class Bridge extends Component {
  // _renderLoading = () => <Loader large />
  unlock = false
  balance = 0
  sokol_bal = 0
  sdk = null
  sokol_sdk = null
  contract_account = ''
  wallet_address = ''
  constructor(props) {
    super(props)
    this.state = {
      unlock: false,
      amount: 0,
      errors: false,
      loading: false,
      loading_msg: ''
    }
  }
  getAccount = async () => {
    //console.log(this.unlock)
    await this.setState({
      loading: true
    })
    //let accountIndex = 0
    /* Query params account switch for testing */

    try {
      const provider = await detectEthereumProvider()

      if (provider) {
        console.log('Ethereum successfully detected!')

        // From now on, this should always be true:
        // provider === window.ethereum

        // Access the decentralized web!

        // Legacy providers may only have ethereum.sendAsync
        const accounts = await provider.request({
          method: 'eth_accounts'
        })
        console.log(accounts, provider)
        let Web3Provider = await Sdk.MetaMaskWalletProvider.connect()
        this.sdk = await new Sdk.Sdk(Web3Provider, {
          networkName: 'mainnet',
          omitWalletProviderNetworkCheck: true
        })
        await this.sdk.computeContractAccount()
        console.info('SDK created')
        const { state: sdkState } = this.sdk
        const { accountAddress: ContractedAccount } = sdkState
        this.contract_account = ContractedAccount
        this.wallet_address = sdkState.walletAddress
        let acc_bal = await this.sdk.getAccountBalances({
          tokens: ['0x6b175474e89094c44da98b954eedeac495271d0f']
        })
        this.balance = ethers.utils.formatEther(
          acc_bal.items[1] == null ? 0 : acc_bal.items[1].balance
        )
        console.log(
          'balances',
          ethers.utils.formatEther(
            acc_bal.items[1] == null ? 0 : acc_bal.items[1].balance
          )
        )
        this.sokol_sdk = await new Sdk.Sdk(Web3Provider, {
          networkName: 'xdai',
          omitWalletProviderNetworkCheck: true
        })
        await this.sokol_sdk.computeContractAccount()
        let sokol_acc_bal = await this.sokol_sdk.getAccountBalances()
        console.log(sokol_acc_bal)
        this.sokol_bal = ethers.utils.formatEther(
          sokol_acc_bal.items[0] == null ? 0 : sokol_acc_bal.items[0].balance
        )
        await this.setState({
          unlock: true,
          loading: false
        })
        console.log(this.unlock)
      } else {
        // if the provider is not detected, detectEthereumProvider resolves to null
        await this.setState({
          loading: false
        })
        alert('Please install MetaMask!')
        console.error('Please install MetaMask!')
      }
    } catch (err) {
      console.log(err)
      this.setState({
        loading: false,
        loading_msg: ''
      })
      alert('Something went wrong! Please try again')
      return null
    }
  }

  getBalance = async () => {
    await this.setState({
      loading: true
    })
    let acc_bal = await this.sdk.getAccountBalances({
      tokens: ['0x6b175474e89094c44da98b954eedeac495271d0f']
    })
    this.balance = ethers.utils.formatEther(
      acc_bal.items[1] == null ? 0 : acc_bal.items[1].balance
    )
    let sokol_acc_bal = await this.sokol_sdk.getAccountBalances()
    console.log(sokol_acc_bal)
    this.sokol_bal = ethers.utils.formatEther(
      sokol_acc_bal.items[0] == null ? 0 : sokol_acc_bal.items[0].balance
    )
    // alert("Balances updated");
    await this.setState({
      loading: false
    })
  }

  xDai_dai = async () => {
    try {
      await this.getBalance()
      await this.setState({
        loading: true,
        loading_msg: ''
      })
      if (Number(this.state.amount) >= 10) {
        if (Number(this.state.amount) <= Number(this.sokol_bal)) {
          let xdai_bridge_address = '0x7301CFA0e1756B71869E93d4e4Dca5c7d0eb0AA6'
          let bridge_contract = '0x6A92e97A568f5F58590E8b1f56484e6268CdDC51'
          let value = ethers.utils.parseEther(this.state.amount)
          // return;
          console.log(await this.sokol_sdk.clearGatewayBatch())
          let output = await this.sokol_sdk.batchExecuteAccountTransaction({
            to: xdai_bridge_address,
            value: value
          })
          await this.setState({
            loading_msg: 'Creating transaction to Bridge'
          })
          console.log('gateway batch', output)

          console.log(
            'gateway batch',
            await this.sokol_sdk.estimateGatewayBatch()
          )

          output = await this.sokol_sdk.submitGatewayBatch()

          console.log('gateway submitted batch', output)
          await this.setState({
            loading_msg:
              'Submitted Transaction to Bridge... Awaiting Confirmation of 8 blocks'
          })

          let flag = 1
          while (flag) {
            let submit_gateway_batch = await this.sokol_sdk.getGatewaySubmittedBatch(
              {
                hash: output.hash
              }
            )
            if (submit_gateway_batch.state === 'Sent' && flag === 1) {
              await this.setState({
                loading_msg:
                  'Transaction Confirmed.. Creating withdrawal request'
              })
              flag = 0
              console.log(submit_gateway_batch.transaction)
              let transaction = await this.sokol_sdk.getTransaction({
                hash: submit_gateway_batch.transaction.hash
              })
              console.log('transaction: ', transaction)
              let currentProvider = new ethers.providers.JsonRpcProvider(
                'https://rpc.xdaichain.com/'
              )
              let contract = await new ethers.Contract(
                bridge_contract,
                xdai_bridge_abi,
                currentProvider
              )
              console.log(await contract.bridge())
              currentProvider.on('block', async blocknumber => {
                console.log(blocknumber)
                if (blocknumber > transaction.blockNumber + 8) {
                  currentProvider.off('block')
                  console.log(
                    'Parameters: ',
                    this.contract_account,
                    value.toString(),
                    submit_gateway_batch.transaction.hash
                  )
                  let getMessageHash_out = await contract.getMessageHash(
                    this.contract_account,
                    value.toString(),
                    transaction.hash
                  )
                  console.log('getMessageHash:-', getMessageHash_out)
                  let getMessage_out = await contract.getMessage(
                    getMessageHash_out
                  )
                  console.log('getMessage:-', getMessage_out)
                  if (getMessage_out !== '0x' && getMessage_out !== '0x0') {
                    let getSignatures_out = await contract.getSignatures(
                      ethers.utils.keccak256(getMessage_out)
                    )
                    console.log('getSignatures:-', getSignatures_out)
                    // return;
                    await this.setState({
                      loading_msg: 'Creating Withdraw transaction'
                    })
                    let encodedData = await abiCoder.encodeFunctionData(
                      'executeSignatures',
                      [getMessage_out, getSignatures_out]
                    )
                    console.log(await this.sdk.clearGatewayBatch())
                    const transaction = await this.sdk.batchExecuteAccountTransaction(
                      {
                        to: erc20Address, //wallet address
                        data: encodedData
                      }
                    )
                    console.log('Estimating transaction', transaction)
                    await this.sdk
                      .estimateGatewayBatch()
                      .then(async result => {
                        console.log('Estimation ', result.estimation)
                        const hash = await this.sdk.submitGatewayBatch()
                        console.log('Transaction submitted ', hash)
                        await this.setState({
                          loading_msg: 'Transaction Submitted'
                        })
                        let flag = 1
                        while (flag) {
                          let submit_gateway_batch = await this.sdk.getGatewaySubmittedBatch(
                            {
                              hash: hash.hash
                            }
                          )
                          if (
                            submit_gateway_batch.state === 'Sending' &&
                            flag === 1
                          ) {
                            flag = 0
                            console.log(submit_gateway_batch.transaction)
                            await this.getBalance()
                            await this.setState({
                              loading: false,
                              loading_msg: ''
                            })
                            alert(
                              'Transferred Successfully ' +
                                submit_gateway_batch.transaction.hash
                            )
                            return
                          } else {
                            await Sdk.sleep(5)
                          }
                        }
                      })
                      .catch(error => {
                        this.setState({
                          loading: false,
                          loading_msg: ''
                        })
                        console.log(
                          'Transaction estimation failed with error ',
                          error
                        )
                      })
                  } else {
                    alert('Invalid entry on withdrawal')
                    console.log('invalid entry')
                    await this.setState({
                      loading: false,
                      loading_msg: ''
                    })
                  }
                }
              })
            } else {
              await Sdk.sleep(5)
              // console.log("i", i++)
            }
          }
        } else {
          alert('Not Enough Balance')
          this.setState({
            loading: false,
            loading_msg: ''
          })
        }
      } else {
        this.setState({
          loading: false,
          loading_msg: ''
        })
        console.log(this.state.errors)
        alert('Minimum amount accepted by Token Bridge is 10')
      }
    } catch (err) {
      this.setState({
        loading: false,
        loading_msg: ''
      })
      console.log(err)
    }
  }

  Dai_to_xDai = async () => {
    try {
      await this.setState({
        loading: true,
        loading_msg: 'Creating Transaction to Bridge'
      })
      console.log(this.state.amount, this.balance)
      if (Number(this.state.amount) >= 10) {
        if (Number(this.state.amount) <= Number(this.balance)) {
          let token = '0x6b175474e89094c44da98b954eedeac495271d0f'

          let value = ethers.utils.parseEther(this.state.amount)

          console.log(await this.sdk.clearGatewayBatch())

          const transactionRequest = tokenabiCoder.encodeFunctionData(
            'transfer',
            [erc20Address, value]
          )

          console.log('transaction request', transactionRequest)

          console.log(
            'gateway batch',
            await this.sdk.batchExecuteAccountTransaction({
              to: token,
              data: transactionRequest
            })
          )
          console.log('gateway batch', await this.sdk.estimateGatewayBatch())

          let output = await this.sdk.submitGatewayBatch()

          console.log('gateway submitted batch', output)
          alert('Transferred to Bridge')
          await this.setState({
            loading: false,
            loading_msg: ''
          })
        } else {
          alert('Not Enough Balance')
          this.setState({
            loading: false,
            loading_msg: ''
          })
        }
      } else {
        this.setState({
          loading: false,
          loading_msg: ''
        })
        console.log(this.state.errors)
        alert('Minimum amount accepted by Token Bridge is 10')
      }
    } catch (err) {
      this.setState({
        loading: false,
        loading_msg: ''
      })
      console.log(err)
    }
  }

  render() {
    let { unlock, errors } = this.state

    const TransferTab = () => {
      console.log(unlock)
      if (unlock) {
        return (
          <div style={{ display: 'flex', 'flex-direction': 'column' }}>
            <Input
              style={{
                margin: '1rem',
                'text-align': 'center',
                'justify-items': 'center',
                'align-content': 'center',
                'align-self': 'center',
                display: 'flex',
                'flex-direction': 'column',
                'flex-wrap': 'nowrap',
                padding: '1rem'
              }}
              hasPrefix={'ETH'}
              type="text"
              placeholder={'Amount'}
              // innerRef={innerRef}
              hasError={!!errors}
              onChange={this._onChange}
            />
            <Button style={{ margin: '1rem' }} onClick={this.Dai_to_xDai}>
              Transfer Dai
            </Button>
          </div>
        )
      } else {
        return (
          <Button style={{ margin: '1rem' }} onClick={this.getAccount}>
            Unlock Wallet
          </Button>
        )
      }
    }

    const TransferTab2 = () => {
      console.log(unlock)
      if (unlock) {
        return (
          <div style={{ display: 'flex', 'flex-direction': 'column' }}>
            <Input
              style={{
                margin: '1rem',
                'text-align': 'center',
                'justify-items': 'center',
                'align-content': 'center',
                'align-self': 'center',
                display: 'flex',
                'flex-direction': 'column',
                'flex-wrap': 'nowrap',
                padding: '1rem'
              }}
              hasPrefix={'ETH'}
              type="text"
              placeholder={'Amount'}
              // innerRef={innerRef}
              hasError={!!errors}
              onChange={this._onChange}
            />
            <Button style={{ margin: '1rem' }} onClick={this.xDai_dai}>
              Transfer xDai
            </Button>
          </div>
        )
      } else {
        return (
          <Button style={{ margin: '1rem' }} onClick={this.getAccount}>
            Unlock Wallet
          </Button>
        )
      }
    }

    return (
      <>
        <div style={{ margin: '5rem' }}>
          {this.state.loading && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                textAlign: 'center'
              }}
            >
              <Loader
                type="ThreeDots"
                color={colours.primary500}
                height="100"
                width="100"
              />
              <h3>
                {this.state.loading_msg === ''
                  ? 'Please Wait'
                  : this.state.loading_msg}
              </h3>
            </div>
          )}
          {!this.state.loading && (
            <Tabs style={{ 'text-align': 'center', flex: 1, margin: '5rem' }}>
              <Tab1
                label="Dai to xDai "
                style={{
                  text_align: 'center',
                  flex: 1,
                  'align-items': 'center',
                  flexDirection: 'row'
                }}
              >
                <bridgeCard>
                  {/* <Card.Header></Card.Header> */}
                  <Card.Body
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignContent: 'center',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    {/* <Card.Title></Card.Title> */}
                    <Card.Text>
                      {(() => {
                        if (this.state.unlock)
                          return (
                            <div>
                              <h4>Key Wallet address: {this.wallet_address}</h4>
                              <h4>
                                Etherspot address: {this.contract_account}
                              </h4>
                              <div
                                style={{
                                  display: 'flex',
                                  alignContent: 'center',
                                  flexWrap: 'nowrap',
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  alignItems: 'center'
                                }}
                              >
                                <h4>Dai Balance: {this.balance} </h4>
                                <IoReloadCircle
                                  style={{
                                    color: 'red',
                                    fontSize: 'xx-large',
                                    margin: '1rem'
                                  }}
                                  onClick={this.getBalance}
                                />
                              </div>
                            </div>
                          )
                      })()}
                    </Card.Text>
                    {TransferTab()}
                  </Card.Body>
                  {/* <Card.Footer className="text-muted">2 days ago</Card.Footer> */}
                </bridgeCard>
              </Tab1>
              <Tab2 label="xDai to Dai">
                <bridgeCard>
                  {/* <Card.Header></Card.Header> */}
                  <Card.Body
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignContent: 'center',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    {/* <Card.Title></Card.Title> */}
                    <Card.Text>
                      <div>
                        <h4>Key Wallet address: {this.wallet_address}</h4>
                        <h4>Etherspot address: {this.contract_account}</h4>
                        <div
                          style={{
                            display: 'flex',
                            alignContent: 'center',
                            flexWrap: 'nowrap',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}
                        >
                          <h4>xDai Balance: {this.sokol_bal}</h4>
                          <IoReloadCircle
                            style={{
                              fontSize: 'xx-large',
                              margin: '1rem',
                              color: 'red'
                            }}
                            onClick={this.getBalance}
                          />
                        </div>
                      </div>
                    </Card.Text>
                    {TransferTab2()}
                  </Card.Body>
                  {/* <Card.Footer className="text-muted">2 days ago</Card.Footer> */}
                </bridgeCard>
              </Tab2>
            </Tabs>
          )}
        </div>
      </>
    )
  }

  _onChange = async e => {
    // this.props.onChangeText(e.target.value)
    // console.log(e.target.value)
    if (e.target.value >= 10) {
      await this.setState({
        amount: e.target.value
      })
      console.log(this.state.amount)
    } else {
      this.state.errors = true
    }
  }
}

export default Bridge
