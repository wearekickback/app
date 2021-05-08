import React from 'react'
import styled from '@emotion/styled'

import { ContainerInner } from '../layout/Layouts'
import mq from '../mediaQuery'

const Team = styled('section')`
  margin-bottom: 200px;
`

const TeamInner = styled(ContainerInner)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  ${mq.small`
    flex-direction: row;
  `};
`

const Member = styled('div')`
  margin: 0 20px;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const MemberName = styled('a')`
  font-weight: 700;
  font-size: 18px;
  color: #000000;
  text-align: center;
  line-height: 28px;
  margin-bottom: 0;

  &:hover {
    color: #6e76ff;
  }
`

const AvatarImg = styled('img')`
  max-width: 100%;
  display: block;
`

const AvatarContainer = styled('div')`
  max-width: 120px;
  overflow: hidden;
  border-radius: 50%;
`

const Avatar = ({ src }) => (
  <AvatarContainer>
    <AvatarImg src={src} />
  </AvatarContainer>
)

const Bio = styled('p')`
  font-size: 13px;
  color: #3d3f50;
  text-align: center;
  line-height: 22px;
`
const avatarUrl =
  'https://res.cloudinary.com/dlxrqqprn/image/twitter_name/w_60,h_60/'

const TeamMembers = () => (
  <Team>
    <h1>The Kickback team</h1>
    <TeamInner>
      <Member>
        <Avatar src={`${avatarUrl}makoto_inoue`} />
        <MemberName href="https://twitter.com/makoto_inoue">
          Makoto Inoue
        </MemberName>
        <Bio>
          The organiser of{' '}
          <a href="https://www.meetup.com/london-ethereum-codeup/">
            London Ethereum Codeup
          </a>{' '}
          where he came up with the original idea of Kickback. Also works at ENS
          as a smart contract developer.
        </Bio>
      </Member>
      <Member>
        <Avatar src={`${avatarUrl}_jefflau`} />
        <MemberName href="https://twitter.com/_jefflau">Jeff Lau</MemberName>
        <Bio>
          Javascripter. Climber. Developer at{' '}
          <a href="https://ens.domains">ENS</a>. Frontend mentor. Distilling the
          complicated in simple ways.
        </Bio>
      </Member>
      <Member>
        <Avatar src={`${avatarUrl}hiddentao`} />
        <MemberName href="https://twitter.com/hiddentao">
          Ramesh Nair
        </MemberName>
        <Bio>
          Full stack developer. Student of life. Former{' '}
          <a href="https://ethereum.org">Ethereum Foundation</a> coder.
        </Bio>
      </Member>
    </TeamInner>
  </Team>
)

export default TeamMembers
