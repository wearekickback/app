#!/usr/bin/env node

const { spawnSync } = require('child_process')
const path = require('path')
const fs = require('fs')
const { argv } = require('yargs')

const projectDir = path.join(__dirname, '..')

// ensure env.json is valid!
const appConfigPath = path.join(projectDir, 'src', 'config', 'env.json')
let appConfig = {}
try {
  appConfig = require(appConfigPath)
} catch (err) {
  /* do nothing */
}

const _set = (k, v) => {
  appConfig[k] = v
}

if (argv.dev) {
  _set('NETWORK', 'ropsten')
  _set('API_URL', 'https://dev.api.kickback.events')

  const commitHash = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: projectDir }).stdout.toString().trim()
  _set('GIT_COMMIT', commitHash)
} else {
  _set('NETWORK', 'local')
  _set('API_URL', 'http://localhost:3001')
}

const str = JSON.stringify(appConfig, null, 2)
console.log(str)

fs.writeFileSync(appConfigPath, str)
