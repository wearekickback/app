import gql from 'graphql-tag'
import React from 'react'
import { Mutation } from 'react-apollo'

export const UPLOAD_FILE = gql`
  mutation uploadFile($file: Upload!) {
    uploadFile(file: $file) {
      filename
    }
  }
`

const uploadOneFile = () => {
  return (
    <Mutation mutation={UPLOAD_FILE}>
      {uploadFile => (
        <input
          type="file"
          required
          onChange={({
            target: {
              validity,
              files: [file]
            }
          }) => {
            console.log(file)
            validity.valid && uploadFile({ variables: { file } })
          }}
        />
      )}
    </Mutation>
  )
}

export default uploadOneFile
