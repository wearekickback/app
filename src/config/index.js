let config = {}
try {
  config = require('./env.json')
} catch (err) {
  /* do nothing */
}

module.exports = {
  ...config
}
