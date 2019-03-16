import React, { Component } from 'react'
import styled from 'react-emotion'
import c from '../../colours'

const GuideWrapper = styled('div')`
  margin-right: 2em;
  position: relative;
  & > a,
  & > div > a {
    color: white;
  }
`

const Menu = styled('div')`
  position: absolute;
  border-radius: 6px;
  background: #f4f5ff;
  box-shadow: 0 4px 6px hsla(0, 0%, 0%, 0.1);
  white-space: nowrap;
  top: 100%;
  transform: translateY(10px);
`

const List = styled('ul')`
  list-style-type: none;
  margin: 0;
  & li:not(:first-child) {
    border-top: #eee solid 1px;
  }
`

const ListItem = styled('li')`
  padding: 10px 20px;
`

const Link = styled('a')`
  color: ${c.primary400};
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
