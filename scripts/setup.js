#!/usr/bin/env node

const path = require('path')
const fs = require('fs')
const { argv } = require('yargs')

// ensure env.json is valid!
const appConfigPath = path.join(__dirname, '..', 'src', 'config', 'env.json')
let appConfig = {}
try {
  appConfig = require(appConfigPath)
} catch (err) {
  /* do nothing */
}

const _set = (k, v) => {
  if (undefined === appConfig[k]) {
    appConfig[k] = v
  }
}

if (argv.dev) {
  _set('NETWORK', 'ropsten')
  _set('API_URL', 'https://dev.kickback.events')
} else {
  _set('API_URL', 'http://localhost:3001')
}

const str = JSON.stringify(appConfig, null, 2)

console.log(str)

fs.writeFileSync(appConfigPath, str)
