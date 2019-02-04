import React from 'react'
import styled from 'react-emotion'

const LoaderContainer = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
`

const LoaderWrapper = ({ large }) => (
  <LoaderContainer>
    <svg
      width={large ? '80' : '40'}
      height={large ? '80' : '40'}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      className="lds-rolling"
    >
      <circle
        cx="50"
        cy="50"
        fill="none"
        stroke="#6e76ff"
        strokeWidth="20"
        r="35"
        strokeDasharray="164.93361431346415 56.97787143782138"
        transform="rotate(83.939 50 50)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          calcMode="linear"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
          dur="1s"
          begin="0s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  </LoaderContainer>
)

export default LoaderWrapper
