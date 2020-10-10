import React from 'react'
import styled from '@emotion/styled'

const BannerContainer = styled('div')`
  padding: 20px 20px;
  text-align: center;
  background: white;
`

export default function Banner() {
  return (
    <BannerContainer>
      <a href="https://gitcoin.co/grants/775/kickback">
        {' '}
        "Support Kickback at Gitcoin CLR Round 7 (ends on October 2nd 2020)"
      </a>
    </BannerContainer>
  )
}
