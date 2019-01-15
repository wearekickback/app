#!/usr/bin/env node

const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const projectDir = path.join(__dirname, '..')
const contractsDirName = '.contracts'

const { version: pkgVersion } = require(path.join(
  projectDir,
  'node_modules',
  '@noblocknoparty/contracts',
  'package.json'
))

console.log(`Contracts package version: ${pkgVersion}`)

const exec = (cmdline, options = {}) => {
  const [cmd, ...args] = cmdline.split(' ')

  const { status, error, stdout } = spawnSync(cmd, args, {
    cwd: projectDir,
    stdio: 'inherit',
    ...options
  })

  if (0 < status || error) {
    console.error(error)
    process.exit(status)
  }

  return stdout ? stdout.toString() : ''
}

const cleanFolder = () => exec(`rm -rf ${contractsDirName}`)

cleanFolder()
exec(
  `git clone -b ${pkgVersion} https://github.com/wearekickback/contracts ./${contractsDirName}`
)

const contractsDir = path.join(projectDir, contractsDirName)

exec('yarn', { cwd: contractsDir })
exec('cp .deployment-sample.js .deployment.js', { cwd: contractsDir })

const output = exec('yarn deploy:local', { cwd: contractsDir, stdio: 'pipe' })

const regex = /contract address:\s+([0-9A-Fa-fx]+)/gm
const [_, address] = regex.exec(output)

console.log(`Deployer address: ${address}`)

let config = {}
try {
  config = require(path.join(projectDir, 'env.json'))
} catch (err) {
  /* do nothing */
}

config.DEPLOYER_CONTRACT_ADDRESS = address

fs.writeFileSync(
  path.join(projectDir, 'src', 'config', 'env.json'),
  JSON.stringify(config, null, 2)
)

cleanFolder()
