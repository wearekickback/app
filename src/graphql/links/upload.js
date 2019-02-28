import { createUploadLink } from 'apollo-upload-client'

import { API_URL } from '../../config'

export default createUploadLink({
  uri: `${API_URL}/graphql`
})
