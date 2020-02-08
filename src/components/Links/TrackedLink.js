import React from 'react'
import { Link } from 'react-router-dom'

import { track } from '../../api/analytics'
import { isExternal } from '../../utils/links'

const TrackedLink = ({ analyticsId, ...props }) => {
  const _onClick = () => {
    if (analyticsId) track(`Click: ${analyticsId}`)
  }

  return isExternal(props.to) ? (
    <a onClick={_onClick} href={props.to} {...props}>
      {props.children}
    </a>
  ) : (
    <Link onClick={_onClick} {...props}>
      {props.children}
    </Link>
  )
}

export default TrackedLink
