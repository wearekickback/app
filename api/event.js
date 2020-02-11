const fetch = require('node-fetch')
const gqlr = require('graphql-request')
const { GraphQLClient } = gqlr
const { API_URL } = require('../src/config')
const { getPartyImage } = require('./utils/parties')

const END_POINT = `${API_URL}/graphql`
const GET_PARTY = `
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

function htmlEncode(str) {
  return str
    ? str
        .replace(/\&/g, '&amp;')
        .replace(/\>/g, '&gt;')
        .replace(/\</g, '&lt;')
        .replace(/\"/g, '&quot;')
    : ''
}

module.exports = async (req, res) => {
  const paths = req.url.split('/')
  const address = paths[paths.length - 1]

  // fetch event info via graphql, and fetch index.html from site
  const baseUrl = `https://${req.headers.host}`
  const client = new GraphQLClient(END_POINT, {
    headers: {
      Authorization: ``
    }
  })
  const [resPage, resParty] = await Promise.all([
    fetch(`${baseUrl}/build/index.html`),
    client.request(GET_PARTY, { address })
  ])

  // replace placeholders with party info
  if (resPage.ok) {
    let html = await resPage.text()
    if (resParty && resParty.party) {
      const { party } = resParty
      const partyName = htmlEncode(party.name)
      const partyDesc = htmlEncode(party.description)
      // Do not render placeholder image
      const partyImage = party.headerImg ? getPartyImage(party.headerImg) : ''
      html = html.replace(
        /\<meta name\=\"description\"(.*?)\/\>/g,
        `<meta name="description" content="${partyDesc}" />`
      )
      html = html.replace(
        /\<meta property\=\"og\:title\"(.*?)\/\>/g,
        `<meta property="og:title" content="${partyName}" />`
      )
      html = html.replace(
        /\<meta property\=\"og\:description\"(.*?)\/\>/g,
        `<meta property="og:description" content="${partyDesc}" />`
      )
      html = html.replace(
        /\<meta property\=\"og\:image\"(.*?)\/\>/g,
        `<meta property="og:image" content="${partyImage}" />`
      )
      html = html.replace(
        /\<meta property\=\"og\:url\"(.*?)\/\>/g,
        `<meta property="og:url" content="${`${baseUrl}${req.url}`}" />`
      )
      html = html.replace(
        /\<meta name\=\"twitter\:title\"(.*?)\/\>/g,
        `<meta name="twitter:title" content="${partyName}" />`
      )
      html = html.replace(
        /\<meta name\=\"twitter\:description\"(.*?)\/\>/g,
        `<meta name="twitter:description" content="${partyDesc}" />`
      )
      html = html.replace(
        /\<meta name\=\"twitter\:image\"(.*?)\/\>/g,
        `<meta name="twitter:image" content="${partyImage}" />`
      )
      html = html.replace(
        /\<title\>Kickback\<\/title\>/g,
        `<title>${partyName}</title>`
      )
    }
    res.send(html)
  } else {
    res.status(503)
    res.send('Cannot open the Kickback app. Please try again later.')
  }
}
