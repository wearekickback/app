import React from "react"
import styled from "react-emotion"
import { ReactComponent as Bubble } from "./Info.svg"

const TooltipContainer = styled("div")`
  position: relative;
  &:hover .text {
    z-index: 1;
    display: block;
  }
`

const Text = styled("div")`
  position: absolute;
  border-radius: 4px;
  display: none;
  color: white;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
`

const Tooltip = ({ text }) => (
  <TooltipContainer>
    <Bubble />
    <Text className="text">{text}</Text>
  </TooltipContainer>
)

export default Tooltip
