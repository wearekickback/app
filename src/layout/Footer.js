import React, { Component } from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'
import { H2 as DefaultH2 } from '../components/Typography/Basic'

const FooterContainer = styled('footer')`
  width: 100%;
  background-color: #6e76ff;
`

const H2 = styled(DefaultH2)`
  color: white;
`

const Social = styled('div')``

const Copyright = styled('div')``

class Footer extends Component {
  render() {
    return (
      <FooterContainer>
        <H2>Get in touch</H2>
        <Link to="/">About</Link>
        <Link to="/">Team</Link>
        <Link to="/">Contact</Link>
        <a href="mailto:hello@kickback.events">hello@kickback.events</a>
        <h2>Kickback</h2>
        <Social>
          <a href="https://github.com/noblocknoparty">Github</a>
          <a href="https://twitter.com/wearekickback">Twitter</a>
        </Social>
        <Copyright>&copy; Kickback 2018</Copyright>
      </FooterContainer>
    )
  }
}

export default Footer
