import React, { Component } from 'react'
import styled from 'react-emotion'
import { Link as DefaultLink } from 'react-router-dom'

import backgroundDark from '../assets/backgroundDark.svg'
import backgroundLight from '../assets/backgroundLight.svg'
import Logo from '../components/Icons/LogoFull'
import { ContainerInner } from '../layout/Layouts'
import LaptopPng from '../assets/laptop.png'
import { ButtonLink } from '../components/Forms/Button'
import { ReactComponent as EventIllustration } from '../assets/eventIllustration.svg'
import { ReactComponent as RSVPIllustration } from '../assets/rsvpIllustration.svg'
import { ReactComponent as OrganiserIllustration } from '../assets/organiserIllustration.svg'
import { ReactComponent as ParticipantsIllustration } from '../assets/participantsIllustration.svg'
import { ReactComponent as SponsorsIllustration } from '../assets/sponsorsIllustration.svg'

import mq from '../mediaQuery'

const Hero = styled('section')`
  background: url(${backgroundDark});
  height: 600px;
  background-size: cover;
  padding-top: 20px;
  padding: 20px 20px 0;

  ${mq.medium`
  `} h3 {
    opacity: 0.75;
    font-family: Muli;
    font-weight: 700;
    font-size: 14px;
    color: #ffffff;
    letter-spacing: 0;
    text-align: center;
    line-height: 42px;
    margin-bottom: 0;
  }

  h2 {
    /* Title: */
    font-family: Muli;
    font-weight: 700;
    font-size: 34px;
    color: #ffffff;
    letter-spacing: 0;
    text-align: center;
    line-height: 42px;
    margin-top: 150px;
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

const TopRow = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Link = styled(DefaultLink)`
  color: white;
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
  margin: 40px auto 0;
  justify-content: center;
  align-items: center;
  margin-bottom: 50px;
  flex-direction: column;
  padding: 0 20px 0;
  overflow: hidden;

  svg {
    order: 0;
    max-width: 100%;
    margin-bottom: 20px;
  }

  ${mq.medium`
    margin: 100px auto 150px;
    flex-direction: row;

    svg {
      order: initial;
      margin-bottom: 0;
    }
  `};
`

const SectionContent = styled('div')`
  max-width: 450px;
  padding: 0 40px;

  p {
    font-family: Muli;
    font-size: 16px;
    color: #3d3f50;
    letter-spacing: 0;
    line-height: 24px;
  }

  order: 2;
  ${mq.medium`
    order: initial
  `};
`

const CTAInner = styled(ContainerInner)`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const CTA = styled('section')`
  padding: 40px 20px 0;
  ${p => p.devcon && `padding: 150px 20px 0;`}
  background: url(${backgroundLight});
  background-size: cover;
  min-height: 450px;
  ${p =>
    p.devcon
      ? mq.medium`
    padding: 150px 20px 0;
  `
      : mq.medium`
  padding: 100px 20px 0;
`};
  h2 {
    font-family: Muli;
    font-weight: 700;
    font-size: 24px;
    text-align: left;
    color: #000000;
    margin-bottom: 10px;

    ${mq.medium`
      text-align: center;
      font-size: 30px;
    `};
  }

  a {
    margin-bottom: 30px;
  }

  p {
    margin-top: 10px;
    margin-bottom: 50px;
    max-width: 420px;
    text-align: center;
  }
`

class Home extends Component {
  render() {
    return (
      <>
        <Hero>
          <ContainerInner>
            <TopRow>
              <Logo />
              <Link to="/events">Events</Link>
            </TopRow>
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
        <CTA devcon>
          <CTAInner>
            <h2>Interested in trying out?</h2>
            <p>We are still in private beta but have a few events already listed</p>
            <ButtonLink analyticsId='See Events' href="/events">Browse events</ButtonLink>
          </CTAInner>
        </CTA>
        <Section>
          <EventIllustration />
          <SectionContent>
            <p>
              Everyone commits a small amount of ETH when they RSVP, which is
              refunded after the event check-in. Any no-shows lose their ETH,
              which can then be split amongst the attendees.
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
        <CTA>
          <CTAInner>
            <h2>Interested in hosting events on Kickback?</h2>
            <p>
              Once KickBack is ready, we would like to open up the platform to
              the limited number of free event organisers.
            </p>
            <ButtonLink
              analyticsId='Request Early Access'
              href="https://docs.google.com/forms/d/e/1FAIpQLSe2RX1yCpGomlG8JI0GiNuUFdWZIyLvCa4YM5VNR7Md4hkqWQ/viewform"
            >
              Request early access
            </ButtonLink>
            <p>
              Or just curious? Say hello to{' '}
              <a href="mailto:hello@kickback.events">hello@kickback.events</a>
            </p>
          </CTAInner>
        </CTA>
      </>
    )
  }
}

export default Home
