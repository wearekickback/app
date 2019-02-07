import React from 'react'

import Clear from './Clear'
import Finalize from './Finalize'
import SetLimit from './SetLimit'
import AddAdmin from './AddAdmin'

export default function AdminPanel({ party }) {
  return (
    <>
      <Finalize party={party} />
      <Clear />
      <SetLimit />
      <AddAdmin />
    </>
  )
}
