import React from 'react'

import Label from '../../Forms/Label'
import Clear from './Clear'
import Finalize from './Finalize'
import SetLimit from './SetLimit'
import AddAdmin from './AddAdmin'

export default function AdminPanel({ party }) {
  return (
    <>
      <Label>Finalize</Label>
      <p>
        Finalize ends the event and allows participants to withdraw. No one will
        be able to be mark attended after you finalize!
      </p>
      <Finalize party={party} />
      <Clear />
      <SetLimit />
      <AddAdmin />
    </>
  )
}
