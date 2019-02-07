const cloudName = 'dlxrqqprn'
const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`
const unsignedUploadPreset = 'cr5ugore'

export function upload(file) {
  const body = new FormData()
  body.append('file', file)
  body.append('upload_preset', unsignedUploadPreset)

  return (
    fetch(cloudinaryUrl, {
      method: 'POST',
      body
    })
      .then(res => res.json()) // json-ify the readable strem
      .then(body => {
        // use the https:// url given by cloudinary; or eager property if using transformations
        const imageUrl = body.eager ? body.eager : body.secure_url

        // set the uploading status to false

        return imageUrl
      })
      // eslint-disable-next-line no-console
      .catch(err => console.log('err', err))
  )
}
