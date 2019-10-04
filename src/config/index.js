let values = require('./env.json')
values.ROLLBAR_TOKEN = ''
values.BLOCKNATIVE_DAPPID = ''

const config = (module.exports = Object.freeze(values))

if (config.GIT_COMMIT) {
  console.log(`Built from git commit: ${config.GIT_COMMIT}`)
}
