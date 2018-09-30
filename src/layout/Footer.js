import React, { PureComponent } from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'

const FooterContainer = styled('footer')`
  width: 100%;
  background: #ccc;
`

const Social = styled('div')``

const Copyright = styled('div')``

class Footer extends PureComponent {
  render() {
    return (
      <FooterContainer>
        Get in touch
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
