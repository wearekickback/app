// const config = (module.exports = Object.freeze(require('./env.json')))

const config = {
  ENV: process.env.REACT_APP_ENV,
  API_URL: process.env.REACT_APP_API_URL,
  NUM_CONFIRMATIONS: process.env.REACT_APP_NUM_CONFIRMATIONS,
  GIT_COMMIT: process.env.REACT_APP_GIT_COMMIT,
  MIXPANEL_ID: process.env.REACT_APP_MIXPANEL_ID,
  LOGROCKET_TOKEN: process.env.REACT_APP_LOGROCKET_TOKEN,
  ROLLBAR_TOKEN: process.env.REACT_APP_ROLLBAR_TOKEN,
  BLOCKNATIVE_DAPPID: process.env.REACT_APP_BLOCKNATIVE_DAPPID,
  DEPLOYER_CONTRACT_ADDRESS: process.env.REACT_APP_DEPLOYER_CONTRACT_ADDRESS
}
if (config.GIT_COMMIT) {
  console.log(`Built from git commit: ${config.GIT_COMMIT}`)
}
