import React, { PureComponent } from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'

import { GlobalConsumer } from '../GlobalState'
import Logo from '../components/Icons/LogoFull'
import Tooltip from '../components/Tooltip'
import Button from '../components/Forms/Button'
import Avatar from '../components/User/Avatar'
import { EDIT_PROFILE } from '../modals'
import { CANNOT_RESOLVE_ACCOUNT_ADDRESS } from '../utils/errors'

const HeaderContainer = styled('header')`
  width: 100%;
  height: 70px;
  background: #6e76ff;
  margin-bottom: 50px;
  padding: 0 20px;
`

const HeaderInner = styled('div')`
  margin: 0 auto 0;
  max-width: 1200px;
  height: 100%;
  display: flex;
  background: #6e76ff;
  justify-content: space-between;
  align-items: center;
`

const RightBar = styled('div')`
  display: flex;
  align-items: center;
`
// const Notifications = styled('div')`
//   color: white;
//   margin-right: 20px;
// `
const Account = styled('div')`
  display: flex;
  align-items: center;
  cursor: pointer;
`
const Username = styled('div')`
  max-width: 100px;
  color: white;
  font-family: 'Muli';
  margin-right: 5px;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const NavLink = styled(Link)`
  color: white;
  margin-right: 30px;
`

export default class Header extends PureComponent {
  render() {
    return (
      <HeaderContainer>
        <HeaderInner>
          <Logo />
          <RightBar>
            <NavLink to="/events">Events</NavLink>
            <GlobalConsumer>
              {({
                reloadUserAddress,
                userProfile,
                networkState,
                loggedIn,
                signIn,
                toggleModal
              }) => {
                const twitterProfile =
                  userProfile &&
                  userProfile.social.find(s => s.type === 'twitter')
                return loggedIn ? (
                  <>
                    {/* <Notifications>Notification</Notifications> */}
                    <Account
                      onClick={() =>
                        toggleModal({
                          name: EDIT_PROFILE
                        })
                      }
                    >
                      {userProfile ? (
                        <Username>{userProfile.username}</Username>
                      ) : null}
                      <Avatar
                        src={`https://avatars.io/twitter/${
                          twitterProfile
                            ? twitterProfile.value
                            : 'unknowntwitter123abc'
                        }/medium`}
                      />
                    </Account>
                  </>
                ) : (
                  <Tooltip
                    text={CANNOT_RESOLVE_ACCOUNT_ADDRESS}
                    position="left"
                  >
                    {({ tooltipElement, showTooltip, hideTooltip }) => (
                      <Button
                        type="light"
                        onClick={this._signIn({
                          showTooltip,
                          hideTooltip,
                          signIn,
                          reloadUserAddress,
                          networkState
                        })}
                        analyticsId="Sign In"
                      >
                        {tooltipElement}
                        Sign in
                      </Button>
                    )}
                  </Tooltip>
                )
              }}
            </GlobalConsumer>
          </RightBar>
        </HeaderInner>
      </HeaderContainer>
    )
  }

  _signIn = ({
    showTooltip,
    hideTooltip,
    signIn,
    networkState,
    reloadUserAddress
  }) => async () => {
    hideTooltip()

    const address = await reloadUserAddress()

    if (!networkState.allGood || !address) {
      return showTooltip()
    }

    signIn()
  }
}
