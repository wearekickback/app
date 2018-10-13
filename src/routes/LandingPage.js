import React, { Component } from 'react'
import styled from 'react-emotion'
import svg from '../assets/heroBackground.svg'
import Logo from '../components/Icons/LogoFull'
import { ContainerInner } from '../layout/Layouts'
import LaptopPng from '../assets/laptop.png'
import { ReactComponent as EventIllustration } from '../assets/eventIllustration.svg'
import { ReactComponent as RSVPIllustration } from '../assets/rsvpIllustration.svg'
import { ReactComponent as OrganiserIllustration } from '../assets/organiserIllustration.svg'
import { ReactComponent as ParticipantsIllustration } from '../assets/participantsIllustration.svg'
import { ReactComponent as SponsorsIllustration } from '../assets/sponsorsIllustration.svg'

const Hero = styled('section')`
  background: url(${svg});
  height: 600px;
  background-size: cover;
  padding-top: 20px;
  padding: 20px 20px 0;
  margin-bottom: 100px;

  h3 {
    opacity: 0.75;
    font-family: Muli;
    font-weight: 700;
    font-size: 14px;
    color: #ffffff;
    letter-spacing: 0;
    text-align: center;
    line-height: 42px;
    margin-bottom: 0;
    margin-top: 50px;
  }

  h2 {
    /* Title: */
    font-family: Muli-Bold;
    font-size: 34px;
    color: #ffffff;
    letter-spacing: 0;
    text-align: center;
    line-height: 42px;
    margin-top: 0;
  }

  p {
    font-weight: 500;
    font-size: 16px;
    color: #ffffff;
    text-align: center;
    line-height: 26px;
    max-width: 500px;
    margin: 0 auto 0;
  }
`
const LaptopWrapper = styled('div')`
  max-width: 640px;
  margin: 50px auto 0;
`

const Laptop = styled('img')`
  width: 100%;
  display: block;
`

const Section = styled('section')`
  display: flex;
  max-width: 1200px;
  margin: 100px auto 0;
  justify-content: center;
`

const SectionContent = styled('div')`
  max-width: 450px;
`

class Home extends Component {
  render() {
    return (
      <>
        <Hero>
          <ContainerInner>
            <Logo />
            <h3>BlockParty is the past. </h3>

            <h2>Say hello to Kickback!</h2>
            <p>
              Event no shows? No problem. Meet Kickback—an Ethereum-based event
              management service that delivers higher event participation rates
              by asking registrants to put some skin in the game.
            </p>
            <LaptopWrapper>
              <Laptop src={LaptopPng} />
            </LaptopWrapper>
          </ContainerInner>
        </Hero>
        <Section>
          <EventIllustration />
          <SectionContent>
            <p>
              Everyone deposits a small amount of ETH when they RSVP, which is
              refunded after the event check-in. Any no-shows lose their
              deposit, which can then be split amongst the attendees, donated to
              charity, or applied to a future event.
            </p>
          </SectionContent>
        </Section>
        <Section>
          <SectionContent>
            <p>
              Using Kickback helps you budget more effectively, guarantees
              higher turnout rates, and makes the RSVP process more fun.
            </p>
          </SectionContent>
          <RSVPIllustration />
        </Section>
        <Section>
          <OrganiserIllustration />
          <SectionContent>
            <h3>For Organisers</h3>
            <p>
              Knowing the exact number of people who will show up at your event
              is hard to estimate. Often half of those who RSVP yes don’t show
              up at all. Using Kickback, you can improve your show/no-show ratio
              from 50% to 90% on average. This allows you to adjust your event
              cost accordingly, while improving the chance of filling your event
              to capacity.
            </p>
          </SectionContent>
        </Section>
        <Section>
          <SectionContent>
            <h3>For Participants</h3>
            <p>
              Frustrated when you can’t get into a free meetup because the event
              is full? When you’re attending a Kickback powered event, you’ve
              got a far better chance of snagging a spot. Only those serious
              about attending take the time to RSVP and commit a small amount of
              ETH. Check out upcoming Kickback powered events, see how it works
              for yourself, and maybe even earn a little extra ETH from those
              no-shows.
            </p>
          </SectionContent>
          <ParticipantsIllustration />
        </Section>

        <Section>
          <SponsorsIllustration />
          <SectionContent>
            <h3>For Sponsors</h3>
            <p>
              With our simple incentivisation model, you have a higher chance of
              connecting with the right audience — people who are interested,
              engaged and committed to attending.
            </p>
          </SectionContent>
        </Section>
      </>
    )
  }
}

export default Home
