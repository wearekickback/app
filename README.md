# Blockparty Dapp

* Dev version: https://dev.noblockno.party
* Live version: https://noblockno.party

## Dev guide

**Deploy our contracts to a local testnet**

Clone the `contracts` repo and run the following commands within:

```
yarn truffle develop
yarn truffle migrate --reset
```

_Note: If you modify/update the contract source code you will need to rebuild
and republish them to NPM and then update the dependency within this app repo
in order to get them working!_

**Run the app**

Install deps:

```
yarn
```

Run the dev server:

```
yarn start
```
