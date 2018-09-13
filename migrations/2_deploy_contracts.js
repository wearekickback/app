var Deployer  = artifacts.require("@noblocknoparty/contracts/Deployer.sol")

module.exports = async function(deployer) {
  await deployer.deploy(Deployer);
  const contract = await Deployer.deployed()
  const result = await contract.deploy(
    'test',
    toHex(toWei('0.02')),
    toHex(2),
    toHex(60 * 60 * 24 * 7),
    'encKey'
  )
}