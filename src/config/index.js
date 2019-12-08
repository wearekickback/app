const config = (module.exports = Object.freeze(require('./env.json')))

if (config.GIT_COMMIT) {
  console.log(`Built from git commit: ${config.GIT_COMMIT}`)
}
