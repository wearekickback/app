import React from 'react'
import styled from '@emotion/styled'
import { Link as DefaultLink } from 'react-router-dom'
import { H2 as DefaultH2 } from '../components/Typography/Basic'
import { ReactComponent as TwitterIcon } from '../components/svg/twitter.svg'
import { ReactComponent as GithubIcon } from '../components/svg/github.svg'
import { ReactComponent as MediumIcon } from '../components/svg/medium.svg'
import { ReactComponent as YoutubeIcon } from '../components/svg/youtube.svg'
import { ReactComponent as TelegramIcon } from '../components/svg/telegram.svg'

import mq from '../mediaQuery'

const FooterContainer = styled('footer')`
  width: 100%;
  background-color: #6e76ff;
  padding: 20px;
`

const FooterInner = styled('div')`
  max-width: 1200px;

  margin: 0 auto 0;
`

const H2 = styled(DefaultH2)`
  color: white;
`

const Row = styled('section')`
  display: flex;
  justify-content: space-between;
`

const MiddleRow = styled(Row)`
  flex-direction: column;

  ${mq.medium`
    flex-direction: row;
  `};
`

const Mail = styled('a')`
  color: white;
  display: flex;
  margin-bottom: 10px;
`

const Links = styled('nav')`
  display: flex;
  margin-bottom: 50px;

  ${mq.medium`
  margin-bottom: 0;
  `};
`

const Link = styled(DefaultLink)`
  color: white;
  margin-right: 30px;

  ${mq.medium`
    margin-right: 0;
    margin-left: 70px;
  `};
`

const ElevatorPitch = styled('div')`
  color: white;
  max-width: 450px;
  font-size: 14px;
  font-weight: 300;
  line-height: 21px;
  margin-bottom: 50px;
`

const Social = styled('div')`
  display: flex;
  align-items: center;
  a {
    margin-left: 30px;
    color: white;
  }

  .twitter {
    margin-top: 2px;
  }
`

const Copyright = styled('div')`
  color: white;
  font-weight: 300;
`

const Footer = () => {
  return (
    <FooterContainer>
      <FooterInner>
        <H2>Get in touch</H2>
        <Mail href="mailto:hello@kickback.events">hello@kickback.events</Mail>
        <MiddleRow>
          <ElevatorPitch>
            Kickback helps event organisers guarantee a high participation rate
            at their events. Our service encourages attendees to treat the
            events they sign up for more seriously.
          </ElevatorPitch>
          <Links>
            <Link to="/team">Team</Link>
            <Link to="/terms">Terms and conditions</Link>
            <Link to="/privacy">Privacy</Link>
          </Links>
        </MiddleRow>
        <Row>
          <Copyright>&copy; 2020 No Block No Party Ltd</Copyright>
          <Social>
            <a href="https://t.me/wearekickback">
              <TelegramIcon />
            </a>
            <a href="https://github.com/wearekickback">
              <GithubIcon />
            </a>
            <a href="https://twitter.com/wearekickback" className="twitter">
              <TwitterIcon />
            </a>
            <a href="https://www.youtube.com/channel/UCEpD7t7AbqeKlzMpIRWZILQ">
              <YoutubeIcon />
            </a>
            <a href="https://medium.com/wearekickback">
              <MediumIcon />
            </a>
          </Social>
        </Row>
      </FooterInner>
    </FooterContainer>
  )
}

export default Footer
