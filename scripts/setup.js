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

if (argv.dev) {
  appConfig.API_URL = 'http://dev.kickback.events'
} else {
  appConfig.API_URL = 'http://localhost:3001'
}

const str = JSON.stringify(appConfig, null, 2)

console.log(str)

fs.writeFileSync(appConfigPath, str)
