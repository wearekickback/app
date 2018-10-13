#!/usr/bin/env node

const { spawnSync } = require('child_process')
const path = require('path')
const fs = require('fs')
const { argv } = require('yargs')

const getGitCommit = () => spawnSync('git', ['rev-parse', 'HEAD'], { cwd: projectDir }).stdout.toString().trim()

const projectDir = path.join(__dirname, '..')

// ensure env.json is valid!
const appConfigPath = path.join(projectDir, 'src', 'config', 'env.json')

let appConfig = {}

// try loading from existing file
try { appConfig = require(appConfigPath) } catch (_) { /* do nothing */ }

appConfig.NETWORK = 'local'
appConfig.API_URL = 'http://localhost:3001'

if (undefined === appConfig.NUM_CONFIRMATIONS) {
  appConfig.NUM_CONFIRMATIONS = 1
}

if (argv.dev) {
  appConfig.NETWORK = 'ropsten'
  appConfig.API_URL = 'https://dev.api.kickback.events'
  appConfig.GIT_COMMIT = getGitCommit()
} else if (argv.live) {
  appConfig.NETWORK = 'mainnet'
  appConfig.API_URL = 'https://live.api.kickback.events'
  appConfig.GIT_COMMIT = getGitCommit()
}

const str = JSON.stringify(appConfig, null, 2)
console.log(str)

fs.writeFileSync(appConfigPath, str)
