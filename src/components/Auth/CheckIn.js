import _ from 'lodash'
import { ApolloConsumer } from 'react-apollo'
import React, { Component } from 'react'
import styled from 'react-emotion'

import Button from '../Forms/Button'
import { CREATE_CHECKIN_CHALLENGE } from '../../graphql/mutations'
import {
  USER_PROFILE_QUERY,
  PARTY_QUERY,
  EVENT_TOTP_QUERY
} from '../../graphql/queries'
import SafeMutation from '../SafeMutation'
import SafeQuery from '../SafeQuery'
import { GlobalConsumer } from '../../GlobalState'
import { H2 as DefaultH2 } from '../Typography/Basic'

import MarkedAttended from './MarkedAttendedRP'
import CheckInButton from './CheckInButton'
import { TOPTInput } from '../Forms/TextInput'
import { ReactComponent as PinIcon } from '../svg/Pin.svg'
import { CHECK_IN } from '../../modals'

const QRCodeContainer = styled('div')`
  margin-bottom: 20px;
`
const CheckInContainer = styled('div')``

const Pin = styled(PinIcon)`
  margin-right: 10px;
`

const H2 = styled(DefaultH2)`
  display: flex;
  align-items: center;
`

const P = styled('p')`
  white-space: nowrap;
  margin-bottom: 10px;
`

const CheckInDiv = styled('div')`
  margin-top: 30px;
`

export default class CheckIn extends Component {
  state = {}

  _scan = client => () => {
    this.setState({ scanError: null }, async () => {
      try {
        const { error, data = {} } = await client.query({
          query: QR_QUERY,
          fetchPolicy: 'no-cache'
        })

        if (error) {
          throw error
        }

        if (data.qrCode) {
          this.props.toptCode = data.qrCode
        }
      } catch (scanError) {
        this.setState({ scanError })
      }
    })
  }

  _onTOPT = val => {
    this.props.toptCode = val
  }

  render() {
    const {
      toptCode,
      enableQrCodeScanner
    } = this.props

    // const { partyAddress } = this.props.match.params //FIXME need way to get partyAddress, no in globals?

    const { scanError } = this.state

    return (
      <CheckInContainer data-testid="check-in-modal">
        <GlobalConsumer>
          {({ partyAddress, userAddress, closeModal }) => ( //FIXME need way to get partyAddress, no in globals?
            <SafeQuery
              query={PARTY_QUERY}
              variables={{ address: partyAddress }}
              // fetchPolicy="cache-and-network"
            >
              {({ data: { partyAddress } }) => {
                return(
                <SafeQuery
                  query={USER_PROFILE_QUERY}
                  variables={{ address: userAddress }}
                >
                  {result => {
                    const hasProfile = !!_.get(result, 'data.profile.username')

                    if (hasProfile) {
                      return this.renderCheckIn(partyAddress, userAddress, closeModal)
                    } else {
                      return //FIXME TODO: render / switch to Signin.js modal here to create or login to account
                    }
                  }}
                  </SafeQuery>
                )
              }}
            </SafeQuery>
          }
        </GlobalConsumer>
      </CheckInContainer>
    )

  renderCheckIn(partyAddress, userAddress, closeModal) {
    return (
      <>
        <H2>
          <Pin />
          Check In for the Event
        </H2>
        <P>Account detected: {userAddress}</P>

        {enableQrCodeScanner ? (
            <SafeQuery query={QR_SUPPORTED_QUERY}>
              {({ data = {} }) => {
                return data.supported ? (
                  <ApolloConsumer>
                    {client => (
                      <QRCodeContainer>
                        <Button onClick={this._scan(client)}>Scan QRCode</Button>
                        {scanError ? (
                          <WarningBox>{`${scanError}`}</WarningBox>
                        ) : null}
                      </QRCodeContainer>
                    )}
                  </ApolloConsumer>
                ) : null
              }}
            </SafeQuery>
          ) : <TOPTInput
                type="text"
                Icon={PinIcon}
                // onChangeText={this._onTOPT} //Should be triggered by CheckInButton below
                value={toptCode}
                placeholder="Enter the Event Check-in Code"
                wide
              />
        }

            <SafeQuery
              query={EVENT_TOTP_QUERY} // FIXME TODO : CHECK THE TOTP and return ability to checkin
              variables={{ $partyAddress: partyAddress, totp: toptCode}} //send address and totp, return pass/fail
            >
              { totpPass ? (
                <CheckInButton
                  onClick={this.runCheckIn({
                    prepareValuesFn,
                    sendDataToServer: ,
                    closeModal
                  })}
                  title="Check In"
                />
              ) : (
                <H2> Check-in Veficication Failed... Try to enter/scan the Check-in code again </H2>
                <Button type="disabled">Check In</Button>
              )} //FIXME TODO: handle failed totp better? Possibly alert instead?
          </SafeQuery>
      </>
    )
  }

  //TODO FIXME : this is a guess at fuctionallity - EVENT_TOTP_QUERY has run, so should be safe to gen  a challenge to sign to then finally get checkin logged in database
  runCheckIn = ({
    prepareValuesFn,
    sendDataToServer,
    closeModal
  }) => async checkTOTP => {
    const dataToSend = !prepareValuesFn
      ? undefined
      : {
          variables: {
            profile: prepareValuesFn()
          }
        }

    await checkTOTP({
      fetchUserProfileFromServer: () => sendDataToServer(dataToSend)
    })

    this.close(closeModal)
  }

  close = closeModal => {
    closeModal({ name: CHECK_IN })
  }
}
}
