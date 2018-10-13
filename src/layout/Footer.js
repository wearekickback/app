import React, { Component } from 'react'
import styled from 'react-emotion'
import { Link as DefaultLink } from 'react-router-dom'
import { H2 as DefaultH2 } from '../components/Typography/Basic'
import { ReactComponent as TwitterIcon } from '../components/svg/twitter.svg'
import { ReactComponent as GithubIcon } from '../components/svg/github.svg'

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

const Links = styled('nav')`
  display: flex;
`

const Link = styled(DefaultLink)`
  color: white;
  margin-left: 100px;
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

class Footer extends Component {
  render() {
    return (
      <FooterContainer>
        <FooterInner>
          <H2>Get in touch</H2>
          <p>
            <a style={{color:'white'}}href="mailto:hello@kickback.events">hello@kickback.events</a>
          </p>
          <Row>
            <ElevatorPitch>
              Kickback helps event organisers guarantee a high participation
              rate at their events. Our service encourages attendees to treat
              the events they sign up for more seriously.
            </ElevatorPitch>
            <Links>
              <Link to="/faq">FAQ</Link>
              <Link to="/terms">Terms and conditions</Link>
              <Link to="/privacy">Privacy</Link>
            </Links>
          </Row>
          <Row>
            <Copyright>&copy; 2018 No Block No Party Ltd</Copyright>
            <Social>
              <a href="https://github.com/noblocknoparty">
                <GithubIcon />
              </a>
              <a href="https://twitter.com/wearekickback" className="twitter">
                <TwitterIcon />
              </a>
            </Social>
          </Row>
        </FooterInner>
      </FooterContainer>
    )
  }
}

export default Footer
