let config = {}
try {
  config = require('./env.json')
} catch (err) {
  /* do nothing */
}

if (config.GIT_COMMIT) {
  console.log(`Built from git commit: ${config.GIT_COMMIT}`)
}

module.exports = Object.freeze({
  ...config
})
