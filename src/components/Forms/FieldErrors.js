import React from 'react'
import styled from 'react-emotion'

const List = styled('ul')`
  display: block;
  text-align: left;
  margin: 0;
`

const ListItem = styled('li')`
  display: block;
  margin: 2px 0;
  font-size: 10px;
  background: #f00;
  color: #fff;
  padding: 0.5em 1em;
`

const FieldErrors = ({ errors }) =>
  errors ? (
    <List>
      {(errors.length ? errors : ['Please complete this field correctly']).map(
        error => (
          <ListItem key={error}>{error}</ListItem>
        )
      )}
    </List>
  ) : null

export default FieldErrors
