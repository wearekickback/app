#!/usr/bin/env node

const path = require('path')
const fs = require('fs')

// ensure env.json is valid!
const appConfigPath = path.join(__dirname, '..', 'src', 'config', 'env.json')
let appConfig = {}
try {
  appConfig = require(appConfigPath)
} catch (err) {
  /* do nothing */
}
fs.writeFileSync(appConfigPath, JSON.stringify(appConfig, null, 2))
