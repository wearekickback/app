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

appConfig.API_URL = 'http://localhost:3001'

if (undefined === appConfig.NUM_CONFIRMATIONS) {
  appConfig.NUM_CONFIRMATIONS = 1
}

if (argv.ropsten) {
  appConfig.API_URL = 'https://ropsten.api.kickback.events'
  appConfig.GIT_COMMIT = getGitCommit()
  appConfig.LOGROCKET_TOKEN = '5gnafo/kickback-ropsten'
  appConfig.ROLLBAR = {
    TOKEN: '37e0bca9006a4a348e244ae2d233d660',
    ENV: 'staging'
  }
} else if (argv.rinkeby) {
  appConfig.API_URL = 'https://rinkeby.api.kickback.events'
  appConfig.GIT_COMMIT = getGitCommit()
  appConfig.LOGROCKET_TOKEN = '5gnafo/kickback-rinkeby'
  appConfig.ROLLBAR = {
    TOKEN: 'e676d64e462b48d098a12db8a173598a',
    ENV: 'staging'
  }
} else if (argv.live) {
  appConfig.API_URL = 'https://live.api.kickback.events'
  appConfig.GIT_COMMIT = getGitCommit()
  appConfig.MIXPANEL_ID = '11a2f7a59470cdb46cb611c5d22876f2'
  appConfig.LOGROCKET_TOKEN = '5gnafo/kickback-live'
  appConfig.ROLLBAR = {
    TOKEN: 'bfb8dfff7ff44f6fa6a13d4571447c28',
    ENV: 'production'
  }
}

const str = JSON.stringify(appConfig, null, 2)
console.log(str)

fs.writeFileSync(appConfigPath, str)
