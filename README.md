# Kickback Dapp

- Dev version: https://dev.noblockno.party
- Live version: https://noblockno.party

## Dev guide

**Install dep**

```shell
yarn
```

**Start a local test network**

In a new terminal:

```shell
npx ganache-cli
```

**Deploy our Deployer contract**

```shell
scripts/deployDeployerToLocalNetwork.js
```

_Note: This will create the file `src/config/env.json` containing the deployer
address_.

**Run the app**

Run the dev server:

```
yarn start
```

**Test creating a event locally**

- Go to http://localhost:3000/create
- Open inspector on your browser
- Fill in event detail and press "Submit"
- Once transaction is complete, then get `deployedAddress` from the event.
- Go to http://localhost:3000/party/$address to see if newly created event is shown.
