import React, { Component } from 'react'
import RulePng from '../assets/guide/rule.png'
import ConnectWalletPng from '../assets/guide/connectwallet.png'
import CreateAccountPng from '../assets/guide/createaccount.png'
import NoDaiPng from '../assets/guide/nodai.png'
import OpenWalletPng from '../assets/guide/openwallet.png'
import RSVPPng from '../assets/guide/rsvp.png'
import ConfirmationPng from '../assets/guide/confirmation.png'
import MarkPng from '../assets/guide/mark.png'
import WithdrawPng from '../assets/guide/withdraw.png'
import styled from '@emotion/styled'
import { P, H3, H1, H2 } from '../components/Typography/Basic'

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

        <H2 id="how-it-works">Kickback rules</H2>

        <ImageWrapper>
          <Img src={RulePng} />
        </ImageWrapper>

        <P></P>
        <H2 id="how-it-works">How to participate</H2>

        <P>
          Our process is pretty similar to any other ticketing service. However,
          there are a few extra steps involved due to the nature of interacting
          with shiny new technology called smart contract that takes care of our
          commitment money without middlemen.
        </P>

        <H3 id="how-to-connect">Connecting to a wallet</H3>

        <P>
          To use our service, you have to access our site with so called
          "Wallet" which is magical internet money. You may have heard of
          Bitcoin but we use the one called Ethereum that has this special smart
          contract capability. Click "Connect to Wallet".
        </P>

        <ImageWrapper>
          <Img src={ConnectWalletPng} />
        </ImageWrapper>

        <P>
          Depending on whether you already have a wallet or not, there are
          several options{' '}
        </P>
        <WalletsWrapper>
          <WalletColumn>
            <H3>I have a crypto wallet</H3>
            <ul>
              <li>
                <a href="https://metamask.io">Metamask</a> extension
              </li>
              <li>
                <a href="http://opera.com">Opera</a> browser
              </li>
              <li>
                <a href="https://walletconnect.org">Wallet connect</a> allows
                you to connect your mobile walletsss
              </li>
            </ul>
          </WalletColumn>
          <WalletColumn>
            <H3>Register with normal browsers</H3>
            <ul>
              <li>
                <a href="https://authereum.com/">Authereum</a>(by email)
              </li>
              <li>
                <a href="https://www.portis.io/">Portis</a>(by email)
              </li>
              <li>
                <a href="https://fortmatic.com">Fortmatic</a>(by phone)
              </li>
              <li>
                <a href="https://tor.us/">Torus</a> (by Gmail)
              </li>
            </ul>
          </WalletColumn>
        </WalletsWrapper>
        <P>
          Once connected, another window will pop up to create an account
          Kickback. Please fill in your detail
        </P>

        <ImageWrapper>
          <Img src={CreateAccountPng} />
        </ImageWrapper>

        <P>
          Make sure you are connected to the correct network (mainnet unless you
          are testing something) and have enough ETH loaded on the wallet
        </P>

        <H3 id="how-to-rsvp">How to RSVP</H3>

        <P>
          To RSVP, you need the token for commitment (usually DAI, which is so
          called "Stable Token" similar to US Dollar) and a small amount of
          Ether to pay the transaction cost callled "gas" (that gets paiid among
          network of people around the world who sustain this middleman-less
          network we use), hence you will show the alert indicating the lack of
          the balance.
        </P>

        <ImageWrapper>
          <Img src={NoDaiPng} />
        </ImageWrapper>

        <P>
          Some of the wallet providers allow you to buy these tokens from their
          wallet. Click "Connected With" button to show a drop down menu, and
          select "Open wallet".
        </P>

        <ImageWrapper>
          <Img src={OpenWalletPng} />
        </ImageWrapper>

        <P>
          Now that you have enough token to commit, you are almost there. To
          allow the smartcontract to take care of your commitment on your
          behhalf, click "Allow RSVP with token", which will pop up a window to
          ask your confirmation. This may take 30 sec to a few minutes depending
          on the traffic of the network. Some wallets allow you to speed up the
          speed by increasing the gas. Once you receive a notification from your
          wallet, the second button "RSVP with x DAI(or any other token)" will
          become clickable. Follow the same step as you just did.
        </P>

        <ImageWrapper>
          <Img src={RSVPPng} />
        </ImageWrapper>

        <P>
          Once complete, you should receive the following email. To check you
          in, we either need to know your username, fullname, or your wallet
          address (which we can scan the QR code).
        </P>

        <ImageWrapper>
          <Img src={ConfirmationPng} />
        </ImageWrapper>

        <P></P>
        <H3 id="when-you-are-at-the-event">When you are at the event</H3>

        <P>
          Once at the event, make sure that the event organisers checked you in.
          Otherwise, your commitment will be split among other attendees.
        </P>

        <ImageWrapper>
          <Img src={MarkPng} />
        </ImageWrapper>

        <H3 id="how-to-get-your-eth-back">How to receive a payout</H3>

        <P>
          After the event is over, you will receive an email that you can now
          withdraw your payout (the commitment you paid + the ones from
          no-shows). Make sure that you withdraw within the cooling period
          unless you want to give it away to the organisers.
        </P>

        <ImageWrapper>
          <Img src={WithdrawPng} />
        </ImageWrapper>
      </GettingStartedContainer>
    )
  }
}

export default GettingStarted
