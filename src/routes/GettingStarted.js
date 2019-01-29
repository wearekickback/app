import React, { Component } from 'react'
import ConnectPng from '../assets/guide/connect.png'
import SignInPng from '../assets/guide/signin.png'
import RSVPPng from '../assets/guide/rsvp.png'
import MarkPng from '../assets/guide/mark.png'
import WithdrawPng from '../assets/guide/withdraw.png'
import styled from 'react-emotion'

const ImageWrapper = styled('div')`
  max-width: 640px;
  margin: 50px auto 0;
`

const WalletsWrapper = styled('div')`
  display: flex;
  justify-content: center;
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

class GettingStarted extends Component {
  render() {
    return (
      <div className="gettingstarted">
        <h1>Getting Started</h1>

        <h2>How it works</h2>
        <p>
          Everyone commits a small amount of ETH when they RSVP, which is
          refunded after the event check-in. Any no-shows lose their ETH, which
          can then be split amongst the attendees.
        </p>

        <h2>How to connect</h2>

        <p>
          To use our service, you have to access our site with Ethereum Wallet.
        </p>
        <WalletsWrapper>
          <WalletColumn>
            <h3>From Desktop</h3>
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
            <h3>From Mobile phone</h3>
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
        <p>Or any other your favorite wallets</p>

        <p>
          Make sure you are connected to the correct network (mainnet unless you
          are testing something) and have enough ETH loaded on the wallet
        </p>

        <ImageWrapper>
          <Img src={ConnectPng} />
        </ImageWrapper>

        <h2>How to sign in</h2>

        <p>
          After clicking “Sign in”, and fill in your detail, you will be asked
          to sign digital signature to confirm your sign in.
        </p>

        <ImageWrapper>
          <Img src={SignInPng} />
        </ImageWrapper>

        <h2>How to RSVP</h2>

        <p>
          After you signed in , click “RSVP” which asks you to confirm the
          transaction.
        </p>

        <ImageWrapper>
          <Img src={RSVPPng} />
        </ImageWrapper>

        <h2>When you are at the event</h2>

        <p>
          Once at the event, make sure that the event organisers checked you in.
          Otherwise, your ETH will be split among other attendees.
        </p>

        <ImageWrapper>
          <Img src={MarkPng} />
        </ImageWrapper>

        <h2>How to get your ETH back</h2>

        <p>
          After the event is over, you will receive email that you can now
          withdraw your ETH. Make sure that you withdraw within the cooling
          period unless you want to give it away to the organisers.
        </p>

        <ImageWrapper>
          <Img src={WithdrawPng} />
        </ImageWrapper>
      </div>
    )
  }
}

export default GettingStarted
