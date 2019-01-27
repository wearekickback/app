import React, { Component } from 'react'
import styled from 'react-emotion'

const DropdownWrapper = styled('div')`
  margin-right: 1em;

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

export default class Dropdown extends Component {
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
      <DropdownWrapper>
        <a onClick={this.toggleMenu}>Guides</a>

        {this.state.showMenu ? (
          <Menu>
            <List>
              <ListItem>
                <Link href="/gettingstarted"> Getting started </Link>
              </ListItem>
              <ListItem>
                <Link href="/faq"> FAQ </Link>
              </ListItem>
              <ListItem>
                <Link href="https://medium.com/wearekickback/kickback-event-organiser-guide-c2146c12defb">
                  Event organiser guide
                </Link>
              </ListItem>
            </List>
          </Menu>
        ) : null}
      </DropdownWrapper>
    )
  }
}
