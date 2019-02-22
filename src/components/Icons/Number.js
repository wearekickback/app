import React from 'react'
import styled from 'react-emotion'

const offset = 308

function getProgressColour(progress) {
  if (progress === 100) {
    return '#42E068'
  } else if (progress > 75) {
    return '#A2E042'
  } else if (progress > 25) {
    return '#E0C842'
  } else if (progress > 0) {
    return '#F86D63'
  } else {
    return '#dfdfdf'
  }
}

const NumberContainer = styled('div')`
  color: ${p => getProgressColour(p.progress)};
  font-size: 16px;
  font-weight: 300;
  position: relative;
  width: 100px;
  height: 100px;

  span {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
`

const SVG = styled('svg')`
  stroke: #ccc;

  circle {
    stroke-dasharray: ${offset};
    stroke-dashoffset: 0;
  }

  circle.progress {
    stroke-dasharray: ${offset};
    stroke-dashoffset: ${p => (offset / 100) * (p.progress - 100)};
  }
`

export default function Number({ number, max, progress }) {
  return (
    <NumberContainer progress={progress}>
      <SVG height="100" width="100" progress={progress}>
        <circle
          cx="50"
          cy="50"
          r="49"
          stroke="#dfdfdf"
          stroke-width="2"
          fill="none"
          transform="rotate(-90, 50, 50)"
        />
        <circle
          cx="50"
          cy="50"
          r="49"
          stroke-width="2"
          stroke={getProgressColour(progress)}
          fill="none"
          className="progress"
          transform="rotate(-90, 50, 50)"
        />
      </SVG>
      <span>{max ? `${number}/${max}` : number}</span>
    </NumberContainer>
  )
}
