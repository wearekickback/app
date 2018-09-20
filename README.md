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

**Clone our backend repo**

Clone the [backend repo](https://githbu.com/noblocknoparty/server) into a sibling folder called `server` such that
directory structure is as follows:

```shell
/my/path
  /my/path/server    <- backend repo
  /my/path/app    <- app repo (this project)
```

**Deploy our Deployer contract to local test network**

Clone the [contracts repo](https://githbu.com/noblocknoparty/contracts) into a sibling folder called `contracts` such that
directory structure is as follows:

```shell
/my/path
  /my/path/contracts    <- contracts repo
  /my/path/server    <- backend repo
  /my/path/app    <- app repo (this project)
```

Now go into the `contracts` repo folder and run:

```shell
yarn deploy:local
```

_Note: This will update both this project and the backend repo project to have
the right deployer address_.

**Run the backend server**



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
