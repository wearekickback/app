const util = require('web3-utils');
const Deployer  = artifacts.require("@noblocknoparty/contracts/Deployer.sol")

const getEvents = (result, eventName) => {
  const events = result.logs.filter(({ event }) => event === eventName)
  return events
}

module.exports = async function(deployer) {
  await deployer.deploy(Deployer);
  const contract = await Deployer.deployed()
  console.log('deployer', contract.address)
  const result = await contract.deploy(
    'test',
    util.toHex(util.toWei('0.02')),
    util.toHex(2),
    util.toHex(60 * 60 * 24 * 7),
    'encKey'
  )
  const events = getEvents(result, 'NewParty')
  console.log('party', events)
}
