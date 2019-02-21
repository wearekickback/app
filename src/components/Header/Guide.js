import React, { Component } from 'react'
import styled from 'react-emotion'

const GuideWrapper = styled('div')`
  margin-right: 2em;

  & > a,
  & > div > a {
    color: white;
  }
`

const Menu = styled('div')`
  position: absolute;
  background: #6e76ff;
`

const List = styled('ul')`
  list-style-type: none;
  margin-top: 1em;
  margin-bottom: 0;
  & li:not(:first-child) {
    border-top: 0.5px solid white;
  }
`

const ListItem = styled('li')`
  padding: 0.5em;
`

const Link = styled('a')`
  color: white;
`

export const links = [
  { label: 'Getting Started', href: '/gettingstarted' },
  { label: 'FAQ', href: '/faq' },
  {
    label: 'Event Organiser guide',
    href:
      'https://medium.com/wearekickback/kickback-event-organiser-guide-c2146c12defb'
  }
]

export default class Guide extends Component {
  constructor() {
    super()

    this.state = {
      showMenu: false
    }

    this.toggleMenu = this.toggleMenu.bind(this)
  }

  toggleMenu(event) {
    event.preventDefault()
    this.setState({
      showMenu: !this.state.showMenu
    })
  }

  render() {
    return (
      <GuideWrapper>
        <a href="#guide" onClick={this.toggleMenu}>
          Guides
        </a>

        {this.state.showMenu ? (
          <Menu>
            <List>
              {links.map(l => (
                <ListItem>
                  <Link href={l.href}>{l.label}</Link>
                </ListItem>
              ))}
            </List>
          </Menu>
        ) : null}
      </GuideWrapper>
    )
  }
}
