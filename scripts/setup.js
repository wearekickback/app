#!/usr/bin/env node

const { spawnSync } = require('child_process')
const path = require('path')
const fs = require('fs')
const { argv } = require('yargs')

const getGitCommit = () =>
  spawnSync('git', ['rev-parse', 'HEAD'], { cwd: projectDir })
    .stdout.toString()
    .trim()

const projectDir = path.join(__dirname, '..')

// ensure env.json is valid!
const appConfigPath = path.join(projectDir, 'src', 'config', 'env.json')

let appConfig = {}

// try loading from existing file
try {
  appConfig = require(appConfigPath)
} catch (_) {
  /* do nothing */
}

appConfig.ENV = 'local'
appConfig.API_URL = 'http://localhost:3001'

if (undefined === appConfig.NUM_CONFIRMATIONS) {
  appConfig.NUM_CONFIRMATIONS = 1
}

if (argv.ropsten) {
  appConfig.ENV = 'ropsten'
  appConfig.API_URL = 'https://kickback-ropsten.herokuapp.com'
  appConfig.GIT_COMMIT = getGitCommit()
  appConfig.ROLLBAR_TOKEN = '37e0bca9006a4a348e244ae2d233d660'
  appConfig.BLOCKNATIVE_DAPPID = '18cb2fa0-5941-43a2-b71d-07221c15a50f'
  appConfig.INFURA_KEY = 'cd1ba006128543a0a11d23e54efaab93'
  appConfig.FORTMATIC_KEY = 'pk_test_D3CAA2AEFE6A022E'
  appConfig.PORTIS_KEY = '0ae69aa0-2a4e-41b2-a312-4aa2de69626e'
  appConfig.SQUARELINK_KEY = '7918e26f77908d911fac'
} else if (argv.rinkeby) {
  appConfig.ENV = 'rinkeby'
  appConfig.API_URL = 'https://kickback-rinkeby.herokuapp.com'
  appConfig.GIT_COMMIT = getGitCommit()
  appConfig.ROLLBAR_TOKEN = 'e676d64e462b48d098a12db8a173598a'
  appConfig.BLOCKNATIVE_DAPPID = '27b3eac2-e46c-428a-9a0c-56cce2725d42'
  appConfig.INFURA_KEY = 'cd1ba006128543a0a11d23e54efaab93'
  appConfig.FORTMATIC_KEY = 'pk_test_D3CAA2AEFE6A022E'
  appConfig.PORTIS_KEY = '0ae69aa0-2a4e-41b2-a312-4aa2de69626e'
  appConfig.SQUARELINK_KEY = '7918e26f77908d911fac'
} else if (argv.kovan) {
  appConfig.ENV = 'kovan'
  appConfig.API_URL = 'https://kickback-kovan.herokuapp.com'
  appConfig.GIT_COMMIT = getGitCommit()
  appConfig.ROLLBAR_TOKEN = ''
  appConfig.BLOCKNATIVE_DAPPID = ''
  appConfig.INFURA_KEY = 'cd1ba006128543a0a11d23e54efaab93'
  appConfig.FORTMATIC_KEY = 'pk_test_D3CAA2AEFE6A022E'
  appConfig.PORTIS_KEY = '0ae69aa0-2a4e-41b2-a312-4aa2de69626e'
  appConfig.SQUARELINK_KEY = '7918e26f77908d911fac'
} else if (argv.alpha) {
  appConfig.ENV = 'alpha'
  appConfig.API_URL = 'https://kickback-alpha.herokuapp.com'
  appConfig.GIT_COMMIT = getGitCommit()
  appConfig.ROLLBAR_TOKEN = ''
  appConfig.BLOCKNATIVE_DAPPID = ''
  appConfig.INFURA_KEY = 'cd1ba006128543a0a11d23e54efaab93'
  appConfig.FORTMATIC_KEY = 'pk_test_D3CAA2AEFE6A022E'
  appConfig.PORTIS_KEY = '0ae69aa0-2a4e-41b2-a312-4aa2de69626e'
  appConfig.SQUARELINK_KEY = '7918e26f77908d911fac'
} else if (argv.xdai) {
  appConfig.ENV = 'xdai'
  appConfig.API_URL = 'https://kickback-xdai.herokuapp.com'
  appConfig.GIT_COMMIT = getGitCommit()
  appConfig.ROLLBAR_TOKEN = ''
  appConfig.BLOCKNATIVE_DAPPID = ''
  appConfig.INFURA_KEY = 'cd1ba006128543a0a11d23e54efaab93'
  appConfig.FORTMATIC_KEY = 'pk_test_D3CAA2AEFE6A022E'
  appConfig.PORTIS_KEY = '0ae69aa0-2a4e-41b2-a312-4aa2de69626e'
  appConfig.SQUARELINK_KEY = '7918e26f77908d911fac'
  appConfig.PLATFORM_FEE_ADDRESS = '0xeC34bf8f41BC951071A501502e1E60Af0cC9f9d6'
} else if (argv.live) {
  appConfig.ENV = 'live'
  appConfig.API_URL = 'https://kickback-live.herokuapp.com'
  appConfig.GIT_COMMIT = getGitCommit()
  appConfig.MIXPANEL_ID = '11a2f7a59470cdb46cb611c5d22876f2'
  appConfig.LOGROCKET_TOKEN = '5gnafo/kickback-live'
  appConfig.ROLLBAR_TOKEN = 'bfb8dfff7ff44f6fa6a13d4571447c28'
  appConfig.BLOCKNATIVE_DAPPID = '612ef703-3041-442c-b246-cf68604b8ce9'
  appConfig.INFURA_KEY = 'cd1ba006128543a0a11d23e54efaab93'
  appConfig.FORTMATIC_KEY = 'pk_live_34FA001C997028B0'
  appConfig.PORTIS_KEY = '0ae69aa0-2a4e-41b2-a312-4aa2de69626e'
  appConfig.SQUARELINK_KEY = '7918e26f77908d911fac'
} else {
  // local
  appConfig.PLATFORM_FEE_ADDRESS = '0x4ef57faD87Ce46e3f63C8F6B7A1ACB987e9140Fe' // Some random address
}
console.log('***appConfig', { appConfig })
const str = JSON.stringify(appConfig, null, 2)
console.log(str)

fs.writeFileSync(appConfigPath, str)
