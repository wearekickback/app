const fs = require('fs')

// Usage:node scripts/merge.js tmp/event.csv tmp/notwithdrawn.csv
// $head tmp/event.csv
// Username,Real Name,Address,Email,Twitter,Marketing
const mergedFile = process.argv[2]
// ~/.../kickback/app (dev)$head tmp/event.csv
// 0x757a2bb0cdc4006c5e1debf21639936b08dca630,dedi
const mergingFile = process.argv[3]

const merged = fs.readFileSync(mergedFile, 'utf8').split('\n')
const merging = fs.readFileSync(mergingFile, 'utf8').split('\n')
const exists = {}
merging.map(m => {
  const [key, value] = m.split(',')
  exists[key] = value
})
const result = merged.map((row, index) => {
  ;[username, realname, address, email, twitter, marketing] = row.split(',')
  if (index == 0) {
    return row + ', Exists'
  } else {
    return [
      username,
      realname,
      address,
      email,
      twitter,
      marketing,
      !!exists[address]
    ].join(',')
  }
})

result.forEach(r => {
  console.log(r)
})
