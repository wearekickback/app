import React, { Component } from 'react'
import ConnectPng from '../assets/guide/connect.png'
import SignInPng from '../assets/guide/signin.png'
import RSVPPng from '../assets/guide/rsvp.png'
import MarkPng from '../assets/guide/mark.png'
import WithdrawPng from '../assets/guide/withdraw.png'
import styled from 'react-emotion'
import { P, H3, H1 } from '../components/Typography/Basic'

const ImageWrapper = styled('div')`
  max-width: 100%;
  margin: 50px auto 0;
`

const WalletsWrapper = styled('div')`
  display: flex;
  justify-content: flex-start;
`

const WalletColumn = styled('div')`
  width: 40%;
  & > ul {
    list-style-type: none;
  }
`

const Img = styled('img')`
  width: 100%;
  display: block;
`

const GettingStartedContainer = styled('div')`
  max-width: 680px;
  margin: 0 auto 0;
`

class GettingStarted extends Component {
  render() {
    return (
      <GettingStartedContainer className="gettingstarted">
        <H1>Getting Started</H1>

        <H3>How it works</H3>
        <P>
          Everyone commits a small amount of ETH when they RSVP, which is
          refunded after the event check-in. Any no-shows lose their ETH, which
          can then be split amongst the attendees.
        </P>

        <H3>How to connect</H3>

        <P>
          To use our service, you have to access our site with an Ethereum
          Wallet.
        </P>
        <WalletsWrapper>
          <WalletColumn>
            <H3>From Desktop</H3>
            <ul>
              <li>
                <a href="https://metamask.io">Metamask</a> Chrome extension
              </li>
              <li>
                <a href="https://brave.com">Brave</a>
              </li>
              <li>
                <a href="http://opera.com">Opera</a>
              </li>
            </ul>
          </WalletColumn>
          <WalletColumn>
            <H3>From Mobile phone</H3>
            <ul>
              <li>
                <a href="https://status.im">Status.im</a>
              </li>
              <li>
                <a href="https://trustwallet.com">Trust</a>
              </li>
              <li>
                <a href="https://wallet.coinbase.com">Coinbase</a>
              </li>
            </ul>
          </WalletColumn>
        </WalletsWrapper>
        <P>Or any other your favorite wallets</P>

        <P>
          Make sure you are connected to the correct network (mainnet unless you
          are testing something) and have enough ETH loaded on the wallet
        </P>

        <ImageWrapper>
          <Img src={ConnectPng} />
        </ImageWrapper>

        <H3>How to sign in</H3>

        <P>
          After clicking “Sign in”, and fill in your detail, you will be asked
          to sign digital signature to confirm your sign in.
        </P>

        <ImageWrapper>
          <Img src={SignInPng} />
        </ImageWrapper>

        <H3>How to RSVP</H3>

        <P>
          After you signed in , click “RSVP” which asks you to confirm the
          transaction.
        </P>

        <ImageWrapper>
          <Img src={RSVPPng} />
        </ImageWrapper>

        <H3>When you are at the event</H3>

        <P>
          Once at the event, make sure that the event organisers checked you in.
          Otherwise, your ETH will be split among other attendees.
        </P>

        <ImageWrapper>
          <Img src={MarkPng} />
        </ImageWrapper>

        <H3>How to get your ETH back</H3>

        <P>
          After the event is over, you will receive email that you can now
          withdraw your ETH. Make sure that you withdraw within the cooling
          period unless you want to give it away to the organisers.
        </P>

        <ImageWrapper>
          <Img src={WithdrawPng} />
        </ImageWrapper>
      </GettingStartedContainer>
    )
  }
}

export default GettingStarted
