const fetch = require('node-fetch')
const gqlr = require('graphql-request')
const { GraphQLClient } = gqlr
const { API_URL } = require('../src/config')

const EndPoint = `${API_URL}/graphql`
const GetParty = `
  query getParty($address: String!) {
    party(address: $address) {
      id
      name
      description
      headerImg
      address
    }
  }
`

module.exports = async (req, res) => {
  const paths = req.url.split('/')
  const address = paths[paths.length - 1]

  // fetch event info via graphql
  const client = new GraphQLClient(EndPoint, {
    headers: {
      Authorization: ``
    }
  })
  const { party } = await client.request(GetParty, { address })

  if (party) {
    // fetch index.html and replace placeholders
    const baseUrl = `https://${req.headers.host}`
    const r = await fetch(`${baseUrl}/build/index.html`)
    if (r.ok) {
      let html = await r.text()
      html = html.replace(
        /\<meta name\=\"description\"(.*?)\/\>/g,
        `<meta name="description" content="${party.description}" />`
      )
      html = html.replace(
        /\<meta property\=\"og\:title\"(.*?)\/\>/g,
        `<meta property="og:title" content="${party.name}" />`
      )
      html = html.replace(
        /\<meta property\=\"og\:description\"(.*?)\/\>/g,
        `<meta property="og:description" content="${party.description}" />`
      )
      html = html.replace(
        /\<meta property\=\"og\:image\"(.*?)\/\>/g,
        `<meta property="og:image" content="${party.headerImg}" />`
      )
      html = html.replace(
        /\<meta property\=\"og\:url\"(.*?)\/\>/g,
        `<meta property="og:url" content="${`${baseUrl}${req.url}`}" />`
      )
      html = html.replace(
        /\<meta name\=\"twitter\:title\"(.*?)\/\>/g,
        `<meta name="twitter:title" content="${party.name}" />`
      )
      html = html.replace(
        /\<meta name\=\"twitter\:description\"(.*?)\/\>/g,
        `<meta name="twitter:description" content="${party.description}" />`
      )
      html = html.replace(
        /\<meta name\=\"twitter\:image\"(.*?)\/\>/g,
        `<meta name="twitter:image" content="${party.headerImg}" />`
      )
      html = html.replace(
        /\<title\>Kickback\<\/title\>/g,
        `<title>${party.name}</title>`
      )
      res.send(html)
    }
  } else {
    res.status(404)
  }
}
