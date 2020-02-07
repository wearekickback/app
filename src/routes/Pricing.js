import React from 'react'
import styled from 'react-emotion'
import { P, H3, H1 } from '../components/Typography/Basic'
import { ButtonLink } from '../components/Forms/Button'

const PricingContainer = styled('div')`
  margin: 0 auto 0;
  max-width: 680px;
  ul {
    padding-left: 2em;
  }
`

function Pricing() {
  return (
    <PricingContainer>
      <H1>#EthDenver special Deal!</H1>
      <P>
        Want to host an event and want to make sure people come? Try Kickback to
        make them pledge to come to your event! We are giving away free
        membership for the first 5 sign up to host events during EthDenver.
        Mention #Denver in our early access request form!
        <br />
        <br />
        <ButtonLink
          analyticsId="Request Early Access"
          href="https://docs.google.com/forms/d/e/1FAIpQLSe2RX1yCpGomlG8JI0GiNuUFdWZIyLvCa4YM5VNR7Md4hkqWQ/viewform"
        >
          Request early access
        </ButtonLink>
      </P>

      <H1>Pricing</H1>
      <H3>The event organiser pays $1 per 1 turn up</H3>
      <P>It’s very simple!</P>

      <P>
        For example, If you have a capacity of 80 people, 70 people RSVP and 50
        people turn up on time, the fee will be $50.
      </P>

      <P>
        Plus VAT depending on the business location your organisation
        operations. We are incorporated in UK and business entities in some
        country may have tax exemption.
      </P>

      <H3>Not convinced yet?</H3>
      <P>
        We will send an invoice after the end of each event so that you only pay
        when you are happy with our service. You can either do a bank transfer
        or send us in DAI. In future we will incorporate the payment mechanism
        into our smart contract.
      </P>

      <H3>Too expensive?</H3>
      <P>
        For recurring events, we will offer a quarterly payment of $150
        ($50/month) for normal events but $45 ($15/month) for events organised
        by non profits, individuals, and students. If you decide to choose the
        quarterly payment model, we ask you to pay upfront. In future we will
        incorporate the recurring payment mechanism into our smart contract.
      </P>

      <H3>Why not charge against the fraction of commitments from no shows?</H3>
      <P>
        I understand where you are coming from. Charging from no shows helps
        event organisers not paying fees. However, our goal is to increase your
        event participation rate and we should not be receiving fee in
        proportion to NOT achieving it.
      </P>
    </PricingContainer>
  )
}

export default Pricing
