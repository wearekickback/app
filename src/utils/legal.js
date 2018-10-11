module.exports = [
  'TERMS_AND_CONDITIONS',
  'PRIVACY_POLICY',
  'MARKETING_INFO',
].reduce((m, v) => {
  m[v] = v
  return m
}, {})
